import abc
import httpx
from typing import List, Dict, Optional, Tuple
from app.core.config import settings
from app.services.safety import SafetyEngine, GLOBAL_MEDICAL_DISCLAIMER
from app.services.medline_service import MedlineService, MEDLINE_LAB_TESTS
from app.services.gemini_provider import GeminiProvider

class AIProvider(abc.ABC):
    @abc.abstractmethod
    async def is_available(self) -> Tuple[bool, str]:
        """Check if provider is online and ready."""
        pass

    @abc.abstractmethod
    async def generate_explanation(
        self,
        test_name: str,
        value: str,
        unit: str,
        ref_range: str,
        comparison_status: str,
        language: str = "en"
    ) -> Dict[str, str]:
        """Generate structured educational explanation for a test."""
        pass

    @abc.abstractmethod
    async def answer_chat(
        self,
        messages: List[Dict[str, str]],
        language: str = "en"
    ) -> Tuple[str, List[dict]]:
        """Generate conversational answer to terminology follow-up."""
        pass

class CuratedGroundingProvider(AIProvider):
    """
    Authoritative, zero-failure provider grounded directly in verified MedlinePlus clinical references.
    Used for instant verified responses, offline environments, and deterministic fallback.
    """
    async def is_available(self) -> Tuple[bool, str]:
        return True, "Verified MedlinePlus Grounded Knowledge Base"

    async def generate_explanation(
        self,
        test_name: str,
        value: str,
        unit: str,
        ref_range: str,
        comparison_status: str,
        language: str = "en"
    ) -> Dict[str, str]:
        entry = MedlineService.find_lab_test_entry(test_name)
        if not entry:
            return {
                "what_it_measures": f"Laboratory assay measuring concentration of {test_name} in sample.",
                "why_ordered": "Clinicians order this test to assist in general health screening or monitoring.",
                "interpretive_limitations": "Individual results must be interpreted alongside your complete clinical history.",
                "medline_title": "Laboratory Tests - MedlinePlus",
                "medline_url": "https://medlineplus.gov/lab-tests/"
            }

        what = entry["what_it_measures"]
        why = entry["why_ordered"]
        limitations = entry["limitations"]

        # Support multilingual explanations if available
        if language in entry.get("translations", {}):
            trans = entry["translations"][language]
            what = trans.get("what_it_measures", what)
            why = trans.get("why_ordered", why)

        return {
            "what_it_measures": what,
            "why_ordered": why,
            "interpretive_limitations": limitations,
            "medline_title": entry["medline_title"],
            "medline_url": entry["medline_url"]
        }

    async def answer_chat(
        self,
        messages: List[Dict[str, str]],
        language: str = "en"
    ) -> Tuple[str, List[dict]]:
        last_user_msg = messages[-1]["content"] if messages else ""
        citations = []

        # Find matching term
        entry = MedlineService.find_lab_test_entry(last_user_msg)
        if entry:
            reply = (
                f"**{entry['canonical_name']}** ({', '.join(entry['abbreviations']) if entry['abbreviations'] else 'Standard Test'}):\n\n"
                f"- **What it measures:** {entry['what_it_measures']}\n"
                f"- **Why clinicians order it:** {entry['why_ordered']}\n"
                f"- **Common Units:** {', '.join(entry['common_units'])}\n"
                f"- **Key Limitations:** {entry['limitations']}\n\n"
                f"*Note: This information is strictly educational and does not constitute medical advice.*"
            )
            citations.append({
                "source": "MedlinePlus, U.S. National Library of Medicine",
                "title": entry["medline_title"],
                "url": entry["medline_url"]
            })
            return reply, citations

        return (
            "LabLens is designed to explain medical terminology, abbreviations, and laboratory reference concepts. "
            "You can ask about tests like Hemoglobin, Creatinine, HbA1c, White Blood Cells, or general concepts like reference ranges. "
            "Remember that LabLens cannot diagnose conditions or recommend medications.",
            [{"source": "MedlinePlus", "title": "MedlinePlus Lab Tests", "url": "https://medlineplus.gov/lab-tests/"}]
        )

class OllamaProvider(AIProvider):
    """
    Primary AI provider: Local Ollama-hosted model (gemma4:12b by default).
    """
    def __init__(self, base_url: str = settings.OLLAMA_BASE_URL, model: str = settings.OLLAMA_MODEL):
        self.base_url = base_url.rstrip("/")
        self.configured_model = model

    async def is_available(self) -> Tuple[bool, str]:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    models = [m.get("name", "") for m in data.get("models", [])]
                    # Check if configured model or compatible model is present
                    has_model = any(self.configured_model in m for m in models)
                    if has_model:
                        return True, f"Ollama online with model {self.configured_model}"
                    if models:
                        return True, f"Ollama online (found models: {', '.join(models)}; configured: {self.configured_model})"
                    return False, "Ollama online, but no models found"
                return False, f"Ollama HTTP error {res.status_code}"
        except Exception as e:
            return False, f"Ollama unreachable: {str(e)}"

    async def _get_active_model(self) -> str:
        """Determines best available model on local Ollama."""
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    models = [m.get("name", "") for m in res.json().get("models", [])]
                    for m in models:
                        if self.configured_model in m:
                            return m
                    # If configured model not found but another is installed (e.g. gemma4:12b)
                    if models:
                        return models[0]
        except Exception:
            pass
        return self.configured_model

    async def generate_explanation(
        self,
        test_name: str,
        value: str,
        unit: str,
        ref_range: str,
        comparison_status: str,
        language: str = "en"
    ) -> Dict[str, str]:
        # Anchor with verified MedlinePlus reference
        grounding = MedlineService.find_lab_test_entry(test_name)
        active_model = await self._get_active_model()

        system_prompt = (
            "You are a medical informatics educator explaining laboratory terms in simple, plain language. "
            "STRICT RULES: NEVER diagnose a disease. NEVER claim an abnormal value proves illness. "
            "NEVER recommend medications, dosages, or treatments. Focus only on what the test measures, "
            "why doctors order it, and interpretive limitations."
        )

        prompt = (
            f"Explain the laboratory test '{test_name}'.\n"
            f"Value: {value} {unit}, Reference Interval: {ref_range}.\n"
            f"Grounding details: {grounding['plain_definition'] if grounding else 'Standard test'}\n"
            f"Respond with 3 concise sentences:\n"
            f"1. What it measures in plain language.\n"
            f"2. Why clinicians commonly order it.\n"
            f"3. General interpretive limitations (e.g. hydration, exercise, lab variance)."
        )

        try:
            async with httpx.AsyncClient(timeout=float(settings.REQUEST_TIMEOUT_SECONDS)) as client:
                resp = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": active_model,
                        "system": system_prompt,
                        "prompt": prompt,
                        "stream": False,
                        "options": {"temperature": 0.2}
                    }
                )
                if resp.status_code == 200:
                    output_text = resp.json().get("response", "")
                    is_safe, sanitized = SafetyEngine.inspect_and_sanitize_output(output_text)
                    if not is_safe:
                        # Fallback to curated if safety violation detected
                        curated = CuratedGroundingProvider()
                        return await curated.generate_explanation(test_name, value, unit, ref_range, comparison_status, language)

                    lines = [line.strip() for line in sanitized.split("\n") if line.strip()]
                    what = lines[0] if len(lines) > 0 else (grounding["what_it_measures"] if grounding else "Standard laboratory marker.")
                    why = lines[1] if len(lines) > 1 else (grounding["why_ordered"] if grounding else "Ordered as part of clinical screening.")
                    limitations = lines[2] if len(lines) > 2 else (grounding["limitations"] if grounding else "Varies by individual clinical context.")

                    return {
                        "what_it_measures": what,
                        "why_ordered": why,
                        "interpretive_limitations": limitations,
                        "medline_title": grounding["medline_title"] if grounding else "MedlinePlus Laboratory Tests",
                        "medline_url": grounding["medline_url"] if grounding else "https://medlineplus.gov/lab-tests/"
                    }
        except Exception:
            pass

        # Bounded graceful fallback
        curated = CuratedGroundingProvider()
        return await curated.generate_explanation(test_name, value, unit, ref_range, comparison_status, language)

    async def answer_chat(
        self,
        messages: List[Dict[str, str]],
        language: str = "en"
    ) -> Tuple[str, List[dict]]:
        active_model = await self._get_active_model()
        system_prompt = (
            "You are LabLens, an educational assistant for medical laboratory report terminology. "
            "You provide clear, plain-language explanations of medical abbreviations, test purposes, and lab concepts. "
            "STRICT PROHIBITION: You must NEVER diagnose medical conditions or recommend medications or dosages. "
            "If asked for medical advice, politely remind the user to consult their licensed doctor."
        )

        conversation = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in messages])
        try:
            async with httpx.AsyncClient(timeout=float(settings.REQUEST_TIMEOUT_SECONDS)) as client:
                resp = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": active_model,
                        "system": system_prompt,
                        "prompt": f"{conversation}\nASSISTANT:",
                        "stream": False,
                        "options": {"temperature": 0.2}
                    }
                )
                if resp.status_code == 200:
                    raw_reply = resp.json().get("response", "")
                    is_safe, sanitized = SafetyEngine.inspect_and_sanitize_output(raw_reply)
                    citations = [{
                        "source": "MedlinePlus, U.S. National Library of Medicine",
                        "title": "MedlinePlus Lab Tests",
                        "url": "https://medlineplus.gov/lab-tests/"
                    }]
                    return sanitized, citations
        except Exception:
            pass

        curated = CuratedGroundingProvider()
        return await curated.answer_chat(messages, language)

class OpenAIProvider(AIProvider):
    """
    Fallback AI provider: Cloud OpenAI API.
    Only triggered if:
    1. Ollama is unavailable
    2. User gave EXPLICIT consent for cloud processing
    3. An OpenAI API key is configured
    """
    def __init__(self, api_key: str = settings.OPENAI_API_KEY, model: str = settings.OPENAI_MODEL):
        self.api_key = api_key
        self.model = model

    async def is_available(self) -> Tuple[bool, str]:
        if not self.api_key:
            return False, "OpenAI API key not configured on server"
        return True, f"OpenAI configured ({self.model})"

    async def generate_explanation(
        self,
        test_name: str,
        value: str,
        unit: str,
        ref_range: str,
        comparison_status: str,
        language: str = "en"
    ) -> Dict[str, str]:
        grounding = MedlineService.find_lab_test_entry(test_name)
        if not self.api_key:
            curated = CuratedGroundingProvider()
            return await curated.generate_explanation(test_name, value, unit, ref_range, comparison_status, language)

        prompt = (
            f"Explain lab test '{test_name}' without diagnosing or prescribing.\n"
            f"Value: {value} {unit}. Return 3 lines: 1) What it measures, 2) Why ordered, 3) Limitations."
        )

        try:
            async with httpx.AsyncClient(timeout=float(settings.REQUEST_TIMEOUT_SECONDS)) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are an educational medical explainer. Never diagnose or prescribe."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.2
                    }
                )
                if res.status_code == 200:
                    content = res.json()["choices"][0]["message"]["content"]
                    _, sanitized = SafetyEngine.inspect_and_sanitize_output(content)
                    lines = [l.strip() for l in sanitized.split("\n") if l.strip()]
                    return {
                        "what_it_measures": lines[0] if len(lines) > 0 else "Laboratory assay.",
                        "why_ordered": lines[1] if len(lines) > 1 else "Ordered for health screening.",
                        "interpretive_limitations": lines[2] if len(lines) > 2 else "Varies by individual clinical factors.",
                        "medline_title": grounding["medline_title"] if grounding else "MedlinePlus Laboratory Tests",
                        "medline_url": grounding["medline_url"] if grounding else "https://medlineplus.gov/lab-tests/"
                    }
        except Exception:
            pass

        curated = CuratedGroundingProvider()
        return await curated.generate_explanation(test_name, value, unit, ref_range, comparison_status, language)

    async def answer_chat(
        self,
        messages: List[Dict[str, str]],
        language: str = "en"
    ) -> Tuple[str, List[dict]]:
        if not self.api_key:
            curated = CuratedGroundingProvider()
            return await curated.answer_chat(messages, language)

        try:
            async with httpx.AsyncClient(timeout=float(settings.REQUEST_TIMEOUT_SECONDS)) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are LabLens educational chat. Never diagnose or recommend medicines."}
                        ] + [{"role": m["role"], "content": m["content"]} for m in messages],
                        "temperature": 0.2
                    }
                )
                if res.status_code == 200:
                    raw = res.json()["choices"][0]["message"]["content"]
                    _, sanitized = SafetyEngine.inspect_and_sanitize_output(raw)
                    return sanitized, [{"source": "MedlinePlus", "title": "MedlinePlus Lab Tests", "url": "https://medlineplus.gov/lab-tests/"}]
        except Exception:
            pass

        curated = CuratedGroundingProvider()
        return await curated.answer_chat(messages, language)

class AIProviderManager:
    """
    Manages selection and execution across AI providers:
    1. Primary: Local Ollama (gemma4:12b / available local)
    2. Fallback: Cloud OpenAI (Strictly gated by explicit user consent)
    3. Curated: Grounded MedlinePlus clinical provider
    """
    def __init__(self):
        self.ollama = OllamaProvider()
        self.gemini = GeminiProvider()
        self.openai = OpenAIProvider()
        self.curated = CuratedGroundingProvider()

    async def check_health(self) -> Dict:
        ollama_ok, ollama_msg = await self.ollama.is_available()
        gemini_ok, gemini_msg = await self.gemini.is_available()
        openai_ok, openai_msg = await self.openai.is_available()
        
        # Discover local models if ollama is running
        available_models = []
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                r = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
                if r.status_code == 200:
                    available_models = [m.get("name", "") for m in r.json().get("models", [])]
        except Exception:
            pass

        has_configured_model = any(settings.OLLAMA_MODEL in m for m in available_models)

        return {
            "status": "healthy",
            "ollama_available": ollama_ok,
            "ollama_model_available": has_configured_model,
            "configured_model": settings.OLLAMA_MODEL,
            "available_models": available_models,
            "gemini_configured": gemini_ok,
            "openai_configured": bool(settings.OPENAI_API_KEY),
            "allow_cloud_fallback_default": settings.ALLOW_CLOUD_FALLBACK,
            "details": {
                "ollama": ollama_msg,
                "gemini": gemini_msg,
                "openai": openai_msg
            }
        }

    async def explain_test(
        self,
        test_name: str,
        value: str,
        unit: str,
        ref_range: str,
        comparison_status: str,
        language: str = "en",
        allow_cloud_consent: bool = False
    ) -> Tuple[Dict[str, str], str, str]:
        """
        Explains test with appropriate provider.
        Returns: (explanation_dict, provider_used, provider_label)
        """
        # 1. Try local Ollama first
        ollama_ok, _ = await self.ollama.is_available()
        if ollama_ok:
            result = await self.ollama.generate_explanation(test_name, value, unit, ref_range, comparison_status, language)
            active_m = await self.ollama._get_active_model()
            return result, "ollama", f"Processed locally with Ollama ({active_m})"

        # 2. If Ollama unavailable, check if user gave explicit cloud consent for OpenAI fallback
        if allow_cloud_consent and settings.OPENAI_API_KEY:
            result = await self.openai.generate_explanation(test_name, value, unit, ref_range, comparison_status, language)
            return result, "openai", "Processed using cloud AI with your consent"

        # 3. Authoritative MedlinePlus curated knowledge base
        result = await self.curated.generate_explanation(test_name, value, unit, ref_range, comparison_status, language)
        return result, "curated", "Processed with verified MedlinePlus clinical references"

    async def chat(
        self,
        messages: List[Dict[str, str]],
        language: str = "en",
        allow_cloud_consent: bool = False
    ) -> Tuple[str, List[dict], str, str]:
        """
        Answers follow-up question.
        Returns: (reply, citations, provider_used, provider_label)
        """
        # First verify safety of latest message
        last_msg = messages[-1]["content"] if messages else ""
        is_safe, refusal_msg, _ = SafetyEngine.inspect_user_prompt(last_msg)
        if not is_safe:
            return refusal_msg, [], "safety_engine", "LabLens Safety Engine"

        # Gemini is used only when cloud processing was explicitly approved.
        if allow_cloud_consent and settings.GEMINI_API_KEY:
            reply, citations = await self.gemini.answer_chat(messages, language)
            return reply, citations, "gemini", f"Processed with Google Gemini ({settings.GEMINI_MODEL})"

        # Otherwise keep chat local with Ollama.
        ollama_ok, _ = await self.ollama.is_available()
        if ollama_ok:
            reply, citations = await self.ollama.answer_chat(messages, language)
            active_m = await self.ollama._get_active_model()
            return reply, citations, "ollama", f"Processed locally with Ollama ({active_m})"

        # 2. Try OpenAI fallback if consent granted
        if allow_cloud_consent and settings.OPENAI_API_KEY:
            reply, citations = await self.openai.answer_chat(messages, language)
            return reply, citations, "openai", "Processed using cloud AI with your consent"

        # 3. Curated provider
        reply, citations = await self.curated.answer_chat(messages, language)
        return reply, citations, "curated", "Processed with verified MedlinePlus clinical references"

ai_provider_manager = AIProviderManager()

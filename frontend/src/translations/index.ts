import { SupportedLanguage } from '../types';

export interface UIStrings {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  understandReportCTA: string;
  searchTermsCTA: string;
  disclaimerTitle: string;
  disclaimerText: string;
  featuresTitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  uploadTitle: string;
  uploadSubtitle: string;
  dragDropText: string;
  orSampleText: string;
  manualEntryTab: string;
  uploadFileTab: string;
  sampleReportsTab: string;
  resultsTitle: string;
  resultsSubtitle: string;
  withinRange: string;
  aboveRange: string;
  belowRange: string;
  unspecifiedRange: string;
  measuresLabel: string;
  whyOrderedLabel: string;
  limitationsLabel: string;
  verifiedSourceLabel: string;
  doctorMedsTitle: string;
  doctorMedsDesc: string;
  chatTitle: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  askButton: string;
  settingsTitle: string;
  localAILabel: string;
  cloudAILabel: string;
  consentCheckbox: string;
}

export const translations: Record<SupportedLanguage, UIStrings> = {
  en: {
    appName: "LabLens",
    tagline: "Understand Your Lab Report",
    heroHeadline: "Demystifying Laboratory Reports with Responsible AI",
    heroSubheadline: "Plain-language explanations of medical laboratory tests, values, and reference ranges grounded in verified MedlinePlus clinical references. Strictly educational, zero automated diagnoses or prescriptions.",
    understandReportCTA: "Understand My Report",
    searchTermsCTA: "Explore Terminology",
    disclaimerTitle: "Important Educational Disclaimer",
    disclaimerText: "LabLens is an educational tool, not a medical diagnostic system. It never diagnoses diseases or recommends medications. Out-of-range lab results do not prove illness and must always be evaluated in clinical context by a licensed healthcare professional.",
    featuresTitle: "Engineered for Clinical Safety & Patient Privacy",
    feature1Title: "MedlinePlus Grounding",
    feature1Desc: "Every explanation cites official MedlinePlus references from the U.S. National Library of Medicine.",
    feature2Title: "Local AI Privacy",
    feature2Desc: "Runs locally using MedGemma via Ollama. No patient data or reports leave your machine without explicit consent.",
    feature3Title: "Doctor-Mentioned Prescriptions",
    feature3Desc: "Isolated recognition of physician prescription text verified against official MedlinePlus drug databases.",
    feature4Title: "Strict Safety Guardrails",
    feature4Desc: "Multi-tiered safety filters immediately reject requests for diagnoses, medication suggestions, or dosages.",
    uploadTitle: "Review or Upload Your Report",
    uploadSubtitle: "Select a sample report, upload a PDF/image, or enter test values manually.",
    dragDropText: "Drag and drop your PDF or image here, or browse files",
    orSampleText: "Or load a sample lab report for instant demonstration",
    manualEntryTab: "Manual Entry",
    uploadFileTab: "Upload Document (PDF / Image)",
    sampleReportsTab: "Pre-Loaded Sample Reports",
    resultsTitle: "Educational Report Explanations",
    resultsSubtitle: "Review test purposes, what they measure, and safe reference range comparisons.",
    withinRange: "Within Laboratory Reference Range",
    aboveRange: "Above Laboratory Reference Range",
    belowRange: "Below Laboratory Reference Range",
    unspecifiedRange: "Reference Range Not Specified",
    measuresLabel: "What This Test Measures",
    whyOrderedLabel: "Why Clinicians Order It",
    limitationsLabel: "Interpretive Limitations",
    verifiedSourceLabel: "Verified Reference",
    doctorMedsTitle: "Medication Information Mentioned in Your Document",
    doctorMedsDesc: "The following medicines were explicitly identified in doctor-authored prescription instructions in your document. They are provided strictly for educational reference and verified via MedlinePlus.",
    chatTitle: "Ask LabLens About Medical Terms",
    chatSubtitle: "Ask about test names, abbreviations, or reference ranges in simple language.",
    chatPlaceholder: "e.g., What does creatinine measure? What is a reference range?",
    askButton: "Ask Question",
    settingsTitle: "AI Provider & Privacy Settings",
    localAILabel: "Primary: Local Ollama (gemma4:12b)",
    cloudAILabel: "Fallback: Cloud AI (OpenAI)",
    consentCheckbox: "I explicitly consent to send stripped, de-identified lab text to cloud AI if local Ollama is unavailable."
  },
  hi: {
    appName: "लैबलेंस (LabLens)",
    tagline: "अपनी लैब रिपोर्ट को सरलता से समझें",
    heroHeadline: "जिम्मेदार एआई के साथ लैब रिपोर्ट को समझें",
    heroSubheadline: "मेडलाइनप्लस (MedlinePlus) के सत्यापित संदर्भों के साथ रक्त और लैब टेस्ट की सरल व्याख्या। केवल शैक्षणिक उद्देश्य हेतु, कोई स्वचालित निदान या दवा की सिफारिश नहीं।",
    understandReportCTA: "मेरी रिपोर्ट समझाएं",
    searchTermsCTA: "चिकित्सा शब्दावली खोजें",
    disclaimerTitle: "महत्वपूर्ण शैक्षणिक सूचना",
    disclaimerText: "लैबलेंस एक शैक्षणिक साधन है, नैदानिक प्रणाली नहीं। यह कभी भी बीमारियों का निदान नहीं करता और न ही दवाइयां सुझाता है। परिणाम की व्याख्या हेतु हमेशा अपने डॉक्टर से परामर्श लें।",
    featuresTitle: "सुरक्षा एवं गोपनीयता के साथ निर्मित",
    feature1Title: "सत्यापित स्रोत",
    feature1Desc: "प्रत्येक स्पष्टीकरण आधिकारिक मेडलाइनप्लस चिकित्सा संदर्भों पर आधारित है।",
    feature2Title: "स्थानीय गोपनीयता",
    feature2Desc: "ओलामा (Ollama) के माध्यम से स्थानीय स्तर पर संचालित। आपकी स्पष्ट सहमति के बिना कोई डेटा बाहर नहीं जाता।",
    feature3Title: "डॉक्टर द्वारा लिखी दवाएं",
    feature3Desc: "दवाओं की जानकारी केवल तभी जब डॉक्टर के पर्चे में स्पष्ट रूप से लिखी गई हो।",
    feature4Title: "सख्त सुरक्षा नियम",
    feature4Desc: "निदान या दवा की सिफारिश संबंधी किसी भी अनुरोध को तुरंत अस्वीकार किया जाता है।",
    uploadTitle: "रिपोर्ट अपलोड या दर्ज करें",
    uploadSubtitle: "सैंपल रिपोर्ट चुनें, पीडीएफ/इमेज अपलोड करें, या मान दर्ज करें।",
    dragDropText: "पीडीएफ या इमेज यहां खींचें या फ़ाइल चुनें",
    orSampleText: "या त्वरित प्रदर्शन के लिए एक सैंपल रिपोर्ट चुनें",
    manualEntryTab: "मैन्युअल प्रविष्टि",
    uploadFileTab: "फ़ाइल अपलोड (PDF / Image)",
    sampleReportsTab: "सैंपल रिपोर्ट्स",
    resultsTitle: "शैक्षणिक रिपोर्ट व्याख्या",
    resultsSubtitle: "टेस्ट के उद्देश्य और संदर्भ सीमाओं की सरल जानकारी।",
    withinRange: "सामान्य संदर्भ सीमा के भीतर",
    aboveRange: "संदर्भ सीमा से अधिक",
    belowRange: "संदर्भ सीमा से कम",
    unspecifiedRange: "संदर्भ सीमा अनिर्दिष्ट",
    measuresLabel: "यह टेस्ट क्या मापता है",
    whyOrderedLabel: "डॉक्टर इसे क्यों लिखते हैं",
    limitationsLabel: "मुख्य सीमाएं",
    verifiedSourceLabel: "सत्यापित संदर्भ",
    doctorMedsTitle: "दस्तावेज़ में उल्लिखित दवाइयां",
    doctorMedsDesc: "यह दवाएं डॉक्टर के पर्चे में पाई गईं और मेडलाइनप्लस द्वारा सत्यापित हैं। केवल शैक्षणिक जानकारी हेतु।",
    chatTitle: "चिकित्सा शब्दावली के बारे में पूछें",
    chatSubtitle: "टेस्ट के नाम, संक्षेप या संदर्भ सीमा के बारे में सरल भाषा में पूछें।",
    chatPlaceholder: "जैसे: क्रिएटिनिन क्या मापता है?",
    askButton: "पूछें",
    settingsTitle: "एआई प्रदाता एवं गोपनीयता सेटिंग्स",
    localAILabel: "प्राथमिक: स्थानीय ओलामा (Ollama)",
    cloudAILabel: "बैकअप: क्लाउड एआई (OpenAI)",
    consentCheckbox: "यदि स्थानीय मॉडल अनुपलब्ध हो, तो मैं क्लाउड एआई के उपयोग की स्पष्ट सहमति देता/देती हूँ।"
  },
  or: {
    appName: "ଲ୍ୟାବ୍‌ଲେନ୍ସ (LabLens)",
    tagline: "ଆପଣଙ୍କ ଲ୍ୟାବ୍ ରିପୋର୍ଟ ସହଜରେ ବୁଝନ୍ତୁ",
    heroHeadline: "ଦାୟିତ୍ୱସମ୍ପନ୍ନ AI ସହିତ ମେଡିକାଲ୍ ରିପୋର୍ଟ ବୁଝନ୍ତୁ",
    heroSubheadline: "ପ୍ରାମାଣିକ MedlinePlus ସନ୍ଦର୍ଭ ସହିତ ଲ୍ୟାବ୍ ପରୀକ୍ଷାର ସରଳ ବ୍ୟାଖ୍ୟା। କେବଳ ଶିକ୍ଷଣୀୟ ଉଦ୍ଦେଶ୍ୟ ପାଇଁ, କୌଣସି ରୋଗ ନିର୍ଣ୍ଣୟ କିମ୍ବା ଔଷଧ ସୁପାରିଶ ନାହିଁ।",
    understandReportCTA: "ମୋ ରିପୋର୍ଟ ବୁଝାନ୍ତୁ",
    searchTermsCTA: "ଶବ୍ଦାବଳୀ ଖୋଜନ୍ତୁ",
    disclaimerTitle: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସତର୍କତା",
    disclaimerText: "ଲ୍ୟାବ୍‌ଲେନ୍ସ କେବଳ ଏକ ଶିକ୍ଷଣୀୟ ସାଧନ। ଏହା କୌଣସି ରୋଗ ଚିହ୍ନଟ କରେ ନାହିଁ କିମ୍ବା ଔଷଧ ଦିଏ ନାହିଁ। ସଠିକ୍ ପରାମର୍ଶ ପାଇଁ ସର୍ବଦା ନିଜ ଡାକ୍ତରଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।",
    featuresTitle: "ସୁରକ୍ଷା ଓ ଗୋପନୀୟତା",
    feature1Title: "ପ୍ରାମାଣିକ ଆଧାର",
    feature1Desc: "ପ୍ରତ୍ୟେକ ବିବରଣୀ ସରକାରୀ MedlinePlus ସନ୍ଦର୍ଭ ଉପରେ ଆଧାରିତ।",
    feature2Title: "ଲୋକାଲ୍ AI ଗୋପନୀୟତା",
    feature2Desc: "ଆପଣଙ୍କ କମ୍ପ୍ୟୁଟରରେ ଲୋକାଲ୍ ଭାବେ ଚାଲେ। ଅନୁମତି ବିନା କୌଣସି ତଥ୍ୟ ବାହାରକୁ ଯାଏ ନାହିଁ।",
    feature3Title: "ଡାକ୍ତର ଲେଖିଥିବା ଔଷଧ",
    feature3Desc: "ଡାକ୍ତରଙ୍କ ପ୍ରେସକ୍ରିପସନରେ ଥିବା ଔଷଧର ସରଳ ସୂଚନା।",
    feature4Title: "କଠୋର ସୁରକ୍ଷା ନିୟମ",
    feature4Desc: "ରୋଗ ନିର୍ଣ୍ଣୟ କିମ୍ବା ଔଷଧ ମାଗିଲେ ତୁରନ୍ତ ମନା କରେ।",
    uploadTitle: "ରିପୋର୍ଟ ଅପଲୋଡ୍ କରନ୍ତୁ",
    uploadSubtitle: "ନମୁନା ରିପୋର୍ଟ ବାଛନ୍ତୁ, PDF/ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା ଟାଇପ୍ କରନ୍ତୁ।",
    dragDropText: "PDF କିମ୍ବା ଫଟୋ ଏଠାରେ ଛାଡନ୍ତୁ",
    orSampleText: "କିମ୍ବା ପରୀକ୍ଷା ପାଇଁ ଏକ ନମୁନା ରିପୋର୍ଟ ଚୟନ କରନ୍ତୁ",
    manualEntryTab: "ନିଜେ ଟାଇପ୍ କରନ୍ତୁ",
    uploadFileTab: "ଫାଇଲ୍ ଅପଲୋଡ୍ (PDF / Image)",
    sampleReportsTab: "ନମୁନା ରିପୋର୍ଟ",
    resultsTitle: "ରିପୋର୍ଟ ବିବରଣୀ",
    resultsSubtitle: "ପରୀକ୍ଷାର ଉଦ୍ଦେଶ୍ୟ ଏବଂ ସୀମା ବିଷୟରେ ସରଳ ବୁଝାମଣା।",
    withinRange: "ସାଧାରଣ ସୀମା ମଧ୍ୟରେ",
    aboveRange: "ସାଧାରଣ ସୀମା ଠାରୁ ଅଧିକ",
    belowRange: "ସାଧାରଣ ସୀମା ଠାରୁ କମ୍",
    unspecifiedRange: "ସୀମା ଉଲ୍ଲେଖ ନାହିଁ",
    measuresLabel: "ଏହି ପରୀକ୍ଷା କ’ଣ ମାପେ",
    whyOrderedLabel: "ଡାକ୍ତର କାହିଁକି ଏହା ଲେଖନ୍ତି",
    limitationsLabel: "ମୁଖ୍ୟ ସୀମାବଦ୍ଧତା",
    verifiedSourceLabel: "ପ୍ରମାଣିତ ସନ୍ଦର୍ଭ",
    doctorMedsTitle: "ଦଲିଲରେ ଉଲ୍ଲେଖ ଥିବା ଔଷଧ",
    doctorMedsDesc: "ଡାକ୍ତରଙ୍କ ନିର୍ଦ୍ଦେଶ ଅନୁସାରେ ଚିହ୍ନଟ ହୋଇଥିବା ଔଷଧର ସୂଚନା। କେବଳ ଶିକ୍ଷଣୀୟ ଉଦ୍ଦେଶ୍ୟ ପାଇଁ।",
    chatTitle: "ଶବ୍ଦାବଳୀ ବିଷୟରେ ପଚାରନ୍ତୁ",
    chatSubtitle: "ପରୀକ୍ଷା ନାମ କିମ୍ବା ସଂକ୍ଷେପ ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।",
    chatPlaceholder: "ଯଥା: କ୍ରିଏଟିନିନ୍ କ’ଣ ମାପେ?",
    askButton: "ପଚାରନ୍ତୁ",
    settingsTitle: "AI ଏବଂ ଗୋପନୀୟତା ସେଟିଙ୍ଗ୍ସ",
    localAILabel: "ପ୍ରାଥମିକ: ଲୋକାଲ୍ Ollama",
    cloudAILabel: "ବିକଳ୍ପ: କ୍ଲାଉଡ୍ AI (OpenAI)",
    consentCheckbox: "ଲୋକାଲ୍ ମଡେଲ୍ ନ ମିଳିଲେ ମୁଁ କ୍ଲାଉଡ୍ AI ବ୍ୟବହାର କରିବାକୁ ସ୍ପଷ୍ଟ ସମ୍ମତି ଦେଉଛି।"
  }
};

from typing import Optional, Dict, List, Tuple
import re

# Authoritative MedlinePlus Lab Tests and Reference Knowledge Base
MEDLINE_LAB_TESTS = {
    "hemoglobin": {
        "canonical_name": "Hemoglobin",
        "abbreviations": ["Hb", "Hgb"],
        "category": "Complete Blood Count",
        "plain_definition": "Hemoglobin is an iron-rich protein in red blood cells that carries oxygen from your lungs to the rest of your body and returns carbon dioxide to the lungs.",
        "what_it_measures": "Measures the amount of hemoglobin protein per volume of blood.",
        "why_ordered": "Clinicians order hemoglobin tests to screen for, detect, or monitor conditions affecting red blood cells, such as anemia, fatigue, blood loss, or nutritional deficiencies.",
        "common_units": ["g/dL", "g/L"],
        "limitations": "Levels can be temporarily shifted by dehydration, smoking, high altitude, recent blood transfusions, or pregnancy.",
        "medline_title": "Hemoglobin Test - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/hemoglobin-test/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त की प्रति इकाई मात्रा में हीमोग्लोबिन प्रोटीन की मात्रा मापता है।",
                "why_ordered": "डॉक्टर एनीमिया, थकान, या रक्त संबंधी समस्याओं की जांच के लिए यह टेस्ट लिखते हैं।",
                "plain_definition": "हीमोग्लोबिन लाल रक्त कोशिकाओं में मौजूद एक प्रोटीन है जो शरीर में ऑक्सीजन पहुंचाने का काम करता है।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ ଥିବା ହିମୋଗ୍ଲୋବିନ ପ୍ରୋଟିନର ପରିମାଣ ମାପିଥାଏ।",
                "why_ordered": "ରକ୍ତହୀନତା ଏବଂ ଦୁର୍ବଳତାର କାରଣ ଜାଣିବା ପାଇଁ ଡାକ୍ତର ଏହି ପରୀକ୍ଷା କରିବାକୁ ପରାମର୍ଶ ଦିଅନ୍ତି।",
                "plain_definition": "ହିମୋଗ୍ଲୋବିନ ହେଉଛି ଲୋହିତ ରକ୍ତ କଣିକାର ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପ୍ରୋଟିନ୍ ଯାହା ଶରୀରକୁ ଅମ୍ଳଜାନ ଯୋଗାଏ।"
            }
        }
    },
    "creatinine": {
        "canonical_name": "Creatinine",
        "abbreviations": ["Cr", "Crea", "Serum Creatinine"],
        "category": "Kidney Function / Metabolic Panel",
        "plain_definition": "Creatinine is a chemical waste molecule produced by muscle metabolism and filtered out of the blood almost entirely by the kidneys.",
        "what_it_measures": "Measures the level of creatinine waste product in the blood or urine to evaluate how effectively the kidneys are filtering waste.",
        "why_ordered": "Routinely ordered to assess kidney health, check for kidney dysfunction, or monitor medications that affect renal filtering.",
        "common_units": ["mg/dL", "umol/L"],
        "limitations": "Muscle mass, strenuous exercise, high protein/meat intake, and specific medications can influence creatinine levels without indicating kidney disease.",
        "medline_title": "Creatinine Test - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/creatinine-test/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त में क्रिएटिनिन की मात्रा मापता है जिससे गुर्दे (किडनी) की कार्यक्षमता का मूल्यांकन होता है।",
                "why_ordered": "किडनी के स्वास्थ्य की निगरानी और दवाओं के प्रभाव को जांचने के लिए यह टेस्ट किया जाता है।",
                "plain_definition": "क्रिएटिनिन मांसपेशियों के काम करने से बनने वाला अपशिष्ट पदार्थ है जिसे किडनी छानकर बाहर निकालती है।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ କ୍ରିଏଟିନିନ୍ ପରିମାଣ ମାପି ବୃକ୍‌କ (କିଡନୀ) ର କାର୍ଯ୍ୟଦକ୍ଷତା ଦର୍ଶାଏ।",
                "why_ordered": "କିଡନୀ ସୁସ୍ଥ ଅଛି କି ନାହିଁ ତାହା ଜାଣିବା ପାଇଁ ଡାକ୍ତର ଏହି ପରୀକ୍ଷା ପରାମର୍ଶ ଦିଅନ୍ତି।",
                "plain_definition": "କ୍ରିଏଟିନିନ୍ ହେଉଛି ମାଂସପେଶୀର କାର୍ଯ୍ୟ ଯୋଗୁଁ ସୃଷ୍ଟି ହେଉଥିବା ବର୍ଜ୍ୟବସ୍ତୁ ଯାହାକୁ କିଡନୀ ସଫା କରିଥାଏ।"
            }
        }
    },
    "fasting blood glucose": {
        "canonical_name": "Fasting Blood Glucose",
        "abbreviations": ["FBG", "FBS", "Glucose", "Blood Sugar"],
        "category": "Metabolic Panel / Diabetes",
        "plain_definition": "Glucose is the main type of sugar in blood and the primary source of cellular energy for the human body.",
        "what_it_measures": "Measures the concentration of free sugar (glucose) circulating in your bloodstream after fasting for 8 to 12 hours.",
        "why_ordered": "Ordered to evaluate carbohydrate metabolism, screen for or manage diabetes, or check for hypoglycemia.",
        "common_units": ["mg/dL", "mmol/L"],
        "limitations": "Stress, recent meals, acute illness, caffeine, and certain medications (like corticosteroids) can elevate blood glucose levels.",
        "medline_title": "Blood Glucose Test - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/blood-glucose-test/",
        "translations": {
            "hi": {
                "what_it_measures": "यह 8-12 घंटे के उपवास के बाद रक्त में ग्लूकोज (शर्करा) की मात्रा मापता है।",
                "why_ordered": "मधुमेह (डायबिटीज) और रक्त शर्करा के संतुलन की जांच के लिए यह टेस्ट कराया जाता है।",
                "plain_definition": "ग्लूकोज रक्त में पाई जाने वाली मुख्य शर्करा है जो शरीर की कोशिकाओं को ऊर्जा प्रदान करती है।"
            },
            "or": {
                "what_it_measures": "ଉପବାସ ପରେ ରକ୍ତରେ ଶର୍କରାର ମାତ୍ରା ମାପିଥାଏ।",
                "why_ordered": "ଡାଇବେଟିସ୍ (ମଧୁମେହ) ର ଯାଞ୍ଚ ପାଇଁ ଏହି ପରୀକ୍ଷା କରାଯାଏ।",
                "plain_definition": "ଗ୍ଲୁକୋଜ ହେଉଛି ରକ୍ତରେ ଥିବା ମୁଖ୍ୟ ଶର୍କରା ଯାହା ଶରୀରକୁ ଶକ୍ତି ଯୋଗାଏ।"
            }
        }
    },
    "hba1c": {
        "canonical_name": "Hemoglobin A1c (HbA1c)",
        "abbreviations": ["A1c", "HbA1c", "Glycated Hemoglobin"],
        "category": "Metabolic Panel / Diabetes",
        "plain_definition": "HbA1c measures the percentage of hemoglobin in red blood cells that has glucose attached to it, reflecting average blood sugar levels over the past 2 to 3 months.",
        "what_it_measures": "Measures glycated hemoglobin to estimate long-term blood glucose control.",
        "why_ordered": "Used to screen for prediabetes and diabetes, and to assess how well existing blood sugar management plans are performing over time.",
        "common_units": ["%", "mmol/mol"],
        "limitations": "Conditions affecting red blood cell lifespan (such as hemolytic anemia, recent blood loss, or sickle cell trait) can distort HbA1c results.",
        "medline_title": "Hemoglobin A1c (HbA1c) Test - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/hemoglobin-a1c-hba1c-test/",
        "translations": {
            "hi": {
                "what_it_measures": "यह पिछले 2 से 3 महीनों के औसत रक्त शर्करा स्तर का माप प्रस्तुत करता है।",
                "why_ordered": "डायबिटीज और प्रीडायबिटीज के दीर्घकालिक नियंत्रण की समीक्षा के लिए यह टेस्ट किया जाता है।",
                "plain_definition": "HbA1c लाल रक्त कोशिकाओं में ग्लूकोज से जुड़े हीमोग्लोबिन के प्रतिशत को मापता है।"
            },
            "or": {
                "what_it_measures": "ଏହା ଗତ ୨-୩ ମାସର ହାରାହାରି ରକ୍ତ ଶର୍କରା ସ୍ତର ଦର୍ଶାଏ।",
                "why_ordered": "ମଧୁମେହ ନିୟନ୍ତ୍ରଣର ଦୀର୍ଘକାଳୀନ ଅବସ୍ଥା ଜାଣିବା ପାଇଁ ଡାକ୍ତର ଏହା ପରାମର୍ଶ ଦିଅନ୍ତି।",
                "plain_definition": "ଏହା ରକ୍ତ କଣିକାରେ ଗ୍ଲୁକୋଜ୍ ଜଡ଼ିତ ହିମୋଗ୍ଲୋବିନର ଶତକଡ଼ା ମାପିଥାଏ।"
            }
        }
    },
    "white blood cell count": {
        "canonical_name": "White Blood Cell Count (WBC)",
        "abbreviations": ["WBC", "Leukocytes"],
        "category": "Complete Blood Count",
        "plain_definition": "White blood cells are vital immune system cells that protect the body against infectious diseases and foreign invaders.",
        "what_it_measures": "Measures the total number of white blood cells present in a volume of blood.",
        "why_ordered": "Ordered to evaluate for infections, systemic inflammation, allergic reactions, immune deficiencies, or bone marrow disorders.",
        "common_units": ["10^3/uL", "x10^9/L", "/mcL"],
        "limitations": "Physical exertion, emotional stress, smoking, and common medications like steroids can naturally increase white blood cell counts.",
        "medline_title": "White Blood Cell Count - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/white-blood-count-wbc/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त में श्वेत रक्त कोशिकाओं (इम्यून सेल्स) की कुल संख्या मापता है।",
                "why_ordered": "संक्रमण (इन्फेक्शन), सूजन या रोग प्रतिरोधक क्षमता की जांच के लिए यह टेस्ट किया जाता है।",
                "plain_definition": "श्वेत रक्त कोशिकाएं शरीर की प्रतिरक्षा प्रणाली का हिस्सा हैं जो बीमारियों से लड़ती हैं।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ ଥିବା ଶ୍ୱେତ ରକ୍ତ କଣିକାର ମୋଟ ସଂଖ୍ୟା ମାପେ।",
                "why_ordered": "ସଂକ୍ରମଣ କିମ୍ବା ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତିର ସ୍ଥିତି ଜାଣିବା ପାଇଁ ଏହି ପରୀକ୍ଷା ହୁଏ।",
                "plain_definition": "ଶ୍ୱେତ ରକ୍ତ କଣିକାଗୁଡ଼ିକ ଶରୀରକୁ ବିଭିନ୍ନ ସଂକ୍ରମଣରୁ ରକ୍ଷା କରନ୍ତି।"
            }
        }
    },
    "platelets": {
        "canonical_name": "Platelet Count",
        "abbreviations": ["PLT", "Platelets", "Thrombocytes"],
        "category": "Complete Blood Count",
        "plain_definition": "Platelets are small cell fragments in the bloodstream essential for normal blood clotting and sealing injured blood vessels.",
        "what_it_measures": "Measures the number of platelets per microliter of blood.",
        "why_ordered": "Evaluates bleeding tendencies, unexplained bruising, clotting disorders, or bone marrow function.",
        "common_units": ["10^3/uL", "/mcL", "x10^9/L"],
        "limitations": "Platelet clumping in test tubes (pseudothrombocytopenia) can falsely register as low; recent viral illnesses can also cause transient fluctuations.",
        "medline_title": "Platelet Tests - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/platelet-tests/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त में थक्के बनाने वाले प्लेटलेट्स की संख्या मापता है।",
                "why_ordered": "रक्तस्राव (ब्लीडिंग), चोट लगने पर थक्का बनने की क्षमता की जांच के लिए यह टेस्ट किया जाता है।",
                "plain_definition": "प्लेटलेट्स रक्त के छोटे कण होते हैं जो चोट लगने पर खून बहने से रोकने में मदद करते हैं।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ ଥିବା ପ୍ଲାଟେଲେଟ୍ସ କଣିକାର ସଂଖ୍ୟା ମାପିଥାଏ।",
                "why_ordered": "ରକ୍ତ ଜମାଟ ବାନ୍ଧିବା କ୍ଷମତା ଏବଂ ରକ୍ତସ୍ରାବ ସମସ୍ୟା ଜାଣିବା ପାଇଁ ଏହା କରାଯାଏ।",
                "plain_definition": "ପ୍ଲାଟେଲେଟ୍ସ ହେଉଛି ରକ୍ତର ଛୋଟ ଅଂଶ ଯାହା କ୍ଷତ ସ୍ଥାନରେ ରକ୍ତ ଜମାଟ ବାନ୍ଧିବାରେ ସାହାଯ୍ୟ କରେ।"
            }
        }
    },
    "total cholesterol": {
        "canonical_name": "Total Cholesterol",
        "abbreviations": ["Chol", "TC"],
        "category": "Lipid Panel",
        "plain_definition": "Cholesterol is a waxy, fat-like substance found in all cells of the body, used to produce hormones, vitamin D, and bile acids.",
        "what_it_measures": "Measures the total amount of cholesterol carried in blood lipoproteins (HDL, LDL, and VLDL).",
        "why_ordered": "Part of a lipid panel to help assess cardiovascular risk and monitor diet, exercise, or lipid-lowering therapies.",
        "common_units": ["mg/dL", "mmol/L"],
        "limitations": "Levels fluctuate with acute illness, weight changes, pregnancy, and dietary variations over preceding days.",
        "medline_title": "Cholesterol Levels - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/cholesterol-levels/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त में कुल कोलेस्ट्रॉल (वसा) की मात्रा मापता है।",
                "why_ordered": "हृदय स्वास्थ्य और कार्डियोवैस्कुलर जोखिम के मूल्यांकन के लिए यह टेस्ट कराया जाता है।",
                "plain_definition": "कोलेस्ट्रॉल शरीर में पाया जाने वाला एक वसायुक्त पदार्थ है जो कोशिकाओं और हार्मोनों के निर्माण के लिए जरूरी है।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ ଥିବା ସମୁଦାୟ କୋଲେଷ୍ଟ୍ରଲ (ସ୍ନେହସାର) ପରିମାଣ ମାପେ।",
                "why_ordered": "ହୃଦୟର ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ଧମନୀର ସ୍ଥିତି ଯାଞ୍ଚ ପାଇଁ ଡାକ୍ତର ଏହି ପରୀକ୍ଷା କରନ୍ତି।",
                "plain_definition": "କୋଲେଷ୍ଟ୍ରଲ ହେଉଛି ଶରୀରରେ ଥିବା ଏକ ଚର୍ବିଜାତୀୟ ତତ୍ତ୍ୱ ଯାହା କୋଷ ଗଠନ ପାଇଁ ଆବଶ୍ୟକ।"
            }
        }
    },
    "alt": {
        "canonical_name": "Alanine Aminotransferase (ALT)",
        "abbreviations": ["ALT", "SGPT"],
        "category": "Liver Function",
        "plain_definition": "ALT is an enzyme found mostly inside liver cells that helps turn proteins into cellular energy.",
        "what_it_measures": "Measures the concentration of ALT enzyme released into the bloodstream, which can increase when liver cells are irritated or injured.",
        "why_ordered": "Ordered to monitor liver health, screen for liver inflammation, or check tolerance of medications metabolized by the liver.",
        "common_units": ["U/L", "IU/L"],
        "limitations": "Strenuous physical exercise, intramuscular injections, and certain non-prescription analgesics can temporarily increase ALT levels.",
        "medline_title": "ALT Blood Test - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/alt-blood-test/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त में एएलटी (ALT) एंजाइम के स्तर को मापता है जो लिवर के स्वास्थ्य को दर्शाता है।",
                "why_ordered": "लिवर में सूजन या दवाओं के प्रभाव की जांच के लिए यह टेस्ट किया जाता है।",
                "plain_definition": "एएलटी मुख्य रूप से लिवर कोशिकाओं में पाया जाने वाला एंजाइम है।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ ALT ଏଞ୍ଜାଇମ୍ର ସ୍ତର ମାପି ଯକୃତ (ଲିଭର) ର ସ୍ୱାସ୍ଥ୍ୟ ଦର୍ଶାଏ।",
                "why_ordered": "ଲିଭରର କାର୍ଯ୍ୟ ଏବଂ ସୁରକ୍ଷା ଯାଞ୍ଚ ପାଇଁ ଏହି ପରୀକ୍ଷା କରାଯାଏ।",
                "plain_definition": "ALT ହେଉଛି ଲିଭର କୋଷଗୁଡ଼ିକରେ ଥିବା ଏକ ଏଞ୍ଜାଇମ୍।"
            }
        }
    },
    "tsh": {
        "canonical_name": "Thyroid-Stimulating Hormone (TSH)",
        "abbreviations": ["TSH", "Thyrotropin"],
        "category": "Thyroid Panel",
        "plain_definition": "TSH is a hormone made by the pituitary gland that instructs the thyroid gland how much thyroid hormones (T3 and T4) to release.",
        "what_it_measures": "Measures TSH levels in the blood to evaluate thyroid balance.",
        "why_ordered": "Used to investigate symptoms such as unexplained weight changes, chronic tiredness, temperature sensitivity, or to monitor thyroid replacement.",
        "common_units": ["uIU/mL", "mIU/L"],
        "limitations": "TSH follows a natural 24-hour diurnal rhythm and can be influenced by severe acute systemic stress, pregnancy, and biotin supplements.",
        "medline_title": "TSH (Thyroid-Stimulating Hormone) Test - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/tsh-thyroid-stimulating-hormone-test/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त में थायरॉयड-उत्तेजक हार्मोन (TSH) की मात्रा मापता है।",
                "why_ordered": "थायरॉयड ग्रंथि की सक्रियता (अंडरएक्टिव या ओवरएक्टिव) की जांच के लिए यह टेस्ट किया जाता है।",
                "plain_definition": "TSH पिट्यूटरी ग्रंथि द्वारा निर्मित एक हार्मोन है जो थायरॉयड को नियंत्रित करता है।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ ଥାଇରଏଡ୍-ଷ୍ଟିମ୍ୟୁଲେଟିଂ ହରମୋନ୍ (TSH) ର ପରିମାଣ ମାପିଥାଏ।",
                "why_ordered": "ଥାଇରଏଡ୍ ଗ୍ରନ୍ଥି ଠିକ୍ ଭାବେ କାମ କରୁଛି କି ନାହିଁ ତାହା ଜାଣିବା ପାଇଁ ଏହା କରାଯାଏ।",
                "plain_definition": "TSH ହେଉଛି ମସ୍ତିଷ୍କର ପିଟ୍ୟୁଟାରୀ ଗ୍ରନ୍ଥି ଦ୍ୱାରା ନିର୍ମିତ ଏକ ହରମୋନ୍ ଯାହା ଥାଇରଏଡ୍କୁ ନିୟନ୍ତ୍ରଣ କରେ।"
            }
        }
    },
    "blood urea nitrogen": {
        "canonical_name": "Blood Urea Nitrogen (BUN)",
        "abbreviations": ["BUN", "Urea Nitrogen", "Urea"],
        "category": "Kidney Function / Metabolic Panel",
        "plain_definition": "Urea nitrogen is a normal waste product created in the liver when dietary protein is broken down, then filtered out by kidneys.",
        "what_it_measures": "Measures the amount of urea nitrogen in the bloodstream.",
        "why_ordered": "Ordered alongside creatinine to assess kidney function, hydration status, and protein breakdown.",
        "common_units": ["mg/dL", "mmol/L"],
        "limitations": "High protein diets, dehydration, gastrointestinal bleeding, or fever can elevate BUN even with healthy kidney function.",
        "medline_title": "BUN (Blood Urea Nitrogen) Test - MedlinePlus",
        "medline_url": "https://medlineplus.gov/lab-tests/bun-blood-urea-nitrogen-test/",
        "translations": {
            "hi": {
                "what_it_measures": "यह रक्त में यूरिया नाइट्रोजन की मात्रा मापता है।",
                "why_ordered": "किडनी की कार्यक्षमता और शरीर में पानी (हाइड्रेशन) के संतुलन की जांच के लिए यह टेस्ट किया जाता है।",
                "plain_definition": "बीयूएन (BUN) प्रोटीन के पाचन से उत्पन्न एक अपशिष्ट उत्पाद है जिसे किडनी शरीर से बाहर निकालती है।"
            },
            "or": {
                "what_it_measures": "ଏହା ରକ୍ତରେ ଥିବା ୟୁରିଆ ନାଇଟ୍ରୋଜେନର ପରିମାଣ ମାପେ।",
                "why_ordered": "କିଡନୀ କାର୍ଯ୍ୟ ଏବଂ ଶରୀରରେ ଜଳୀୟ ଅଂଶ ଯାଞ୍ଚ ପାଇଁ ଏହା ବ୍ୟବହୃତ ହୁଏ।",
                "plain_definition": "ୟୁରିଆ ନାଇଟ୍ରୋଜେନ୍ ହେଉଛି ପ୍ରୋଟିନ୍ ହଜମରୁ ସୃଷ୍ଟି ହେଉଥିବା ବର୍ଜ୍ୟବସ୍ତୁ ଯାହାକୁ କିଡନୀ ଛାଣିଥାଏ।"
            }
        }
    }
}

# Verified Official MedlinePlus Drug Information Directory (Section 2.3 & 3 & Feature G)
# Only matched when explicitly present in physician-authored prescription text.
VERIFIED_MEDLINE_DRUGS = {
    "metformin": {
        "canonical_name": "Metformin",
        "medline_title": "Metformin: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a696005.html",
        "summary": "Metformin is an oral biguanide medicine used in managing blood sugar levels."
    },
    "atorvastatin": {
        "canonical_name": "Atorvastatin",
        "medline_title": "Atorvastatin: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a600045.html",
        "summary": "Atorvastatin is an HMG-CoA reductase inhibitor (statin) used to lower blood cholesterol levels."
    },
    "lisinopril": {
        "canonical_name": "Lisinopril",
        "medline_title": "Lisinopril: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a692051.html",
        "summary": "Lisinopril is an ACE inhibitor used in managing blood pressure."
    },
    "levothyroxine": {
        "canonical_name": "Levothyroxine",
        "medline_title": "Levothyroxine: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a682461.html",
        "summary": "Levothyroxine is a synthetic thyroid hormone replacement medicine."
    },
    "amlodipine": {
        "canonical_name": "Amlodipine",
        "medline_title": "Amlodipine: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a692044.html",
        "summary": "Amlodipine is a calcium channel blocker used in blood pressure management."
    },
    "amoxicillin": {
        "canonical_name": "Amoxicillin",
        "medline_title": "Amoxicillin: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a685001.html",
        "summary": "Amoxicillin is a penicillin-class antibacterial medication."
    },
    "omeprazole": {
        "canonical_name": "Omeprazole",
        "medline_title": "Omeprazole: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a693050.html",
        "summary": "Omeprazole is a proton pump inhibitor (PPI) that decreases stomach acid production."
    },
    "losartan": {
        "canonical_name": "Losartan",
        "medline_title": "Losartan: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a695008.html",
        "summary": "Losartan is an angiotensin II receptor antagonist used in blood pressure management."
    },
    "pantoprazole": {
        "canonical_name": "Pantoprazole",
        "medline_title": "Pantoprazole: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a601246.html",
        "summary": "Pantoprazole is a proton pump inhibitor used to decrease acid production."
    },
    "furosemide": {
        "canonical_name": "Furosemide",
        "medline_title": "Furosemide: MedlinePlus Drug Information",
        "medline_url": "https://medlineplus.gov/druginfo/meds/a682858.html",
        "summary": "Furosemide is a loop diuretic medication used to treat fluid build-up."
    }
}

class MedlineService:
    @staticmethod
    def find_lab_test_entry(query: str) -> Optional[dict]:
        """
        Locates a verified laboratory test entry by test name or abbreviation.
        """
        clean_q = query.strip().lower()
        # Direct key match
        if clean_q in MEDLINE_LAB_TESTS:
            return MEDLINE_LAB_TESTS[clean_q]

        # Scan aliases and abbreviations
        for key, entry in MEDLINE_LAB_TESTS.items():
            if clean_q == entry["canonical_name"].lower():
                return entry
            for abbr in entry.get("abbreviations", []):
                if clean_q == abbr.lower():
                    return entry
            if clean_q in key or key in clean_q:
                return entry

        return None

    @staticmethod
    def verify_doctor_medicine(name: str) -> Tuple[bool, Optional[str], Optional[str], str]:
        """
        Strictly verifies a doctor-mentioned medicine against verified MedlinePlus drug pages.
        Returns: (verified, medline_url, medline_title, note)
        Rule 2.3: If no matching MedlinePlus drug page can be verified,
        show: "No matching MedlinePlus drug-information page could be verified."
        Never fabricate a MedlinePlus URL or substitute an unrelated drug.
        """
        clean = name.strip().lower()
        # Strip common dosage indicators like "500mg", "tab", "oral"
        clean_drug = re.sub(r"\b\d+\s*(?:mg|mcg|ml|g)\b", "", clean)
        clean_drug = re.sub(r"\b(?:tab|tablet|cap|capsule|inj|oral|daily|od|bid|tid)\b", "", clean_drug).strip()

        for key, drug in VERIFIED_MEDLINE_DRUGS.items():
            if key == clean_drug or key in clean_drug or clean_drug in key:
                return (
                    True,
                    drug["medline_url"],
                    drug["medline_title"],
                    "Verified official MedlinePlus Drug Information reference. Educational information only; not a prescription or clinical endorsement."
                )

        return (
            False,
            None,
            None,
            "No matching MedlinePlus drug-information page could be verified."
        )

    @staticmethod
    def search_terminology(query: str = "") -> List[dict]:
        """
        Searches laboratory terminology catalog.
        """
        q = query.strip().lower()
        results = []
        for key, entry in MEDLINE_LAB_TESTS.items():
            if not q or (
                q in key
                or q in entry["canonical_name"].lower()
                or any(q in abbr.lower() for abbr in entry.get("abbreviations", []))
                or q in entry["plain_definition"].lower()
            ):
                results.append({
                    "term": entry["canonical_name"],
                    "test_name": entry["canonical_name"],
                    "abbreviations": entry["abbreviations"],
                    "category": entry["category"],
                    "plain_definition": entry["plain_definition"],
                    "what_it_measures": entry["what_it_measures"],
                    "why_ordered": entry["why_ordered"],
                    "common_units": entry["common_units"],
                    "limitations": entry["limitations"],
                    "medline_url": entry["medline_url"],
                    "medline_title": entry["medline_title"]
                })
        return results

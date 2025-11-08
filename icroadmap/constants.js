export const Language = Object.freeze({
  EN: 'en',
  AR: 'ar',
});

export const i18n = {
  [Language.EN]: {
    // Header
    navServices: "Our Services",
    navSpecializedPrograms: "Specialized Programs",
    bookDemo: "Book a Consultation",

    // Hero
    heroTitle: "Validate Your Team's Expertise. We Build the Path to Certification.",
    heroSubtitle: "As your educational agency partner, we specialize in designing, delivering, and supporting comprehensive training programs that lead to recognized certifications.",
    heroButton: "Get Started",

    // Partners
    partnersSection: {
      title: "Trusted By Leading Organizations",
      subtitle: "Our partnerships ensure the highest quality education and global recognition",
      cards: [
        { title: "Global University Network", icon: "BuildingOfficeIcon" },
        { title: "International Education Council", icon: "BookOpenIcon" },
        { title: "World Education Alliance", icon: "GlobeAltIcon" },
        { title: "Professional Training Institute", icon: "BriefcaseIcon" }
      ]
    },

    // About Us
    aboutUs: {
      tag: "About Us",
      title1: "Leading the Way in",
      title2: "Educational Excellence",
      description1: "As a new force in the educational landscape, we are dedicated to redefining professional development. We design and deliver innovative certification programs that add tangible value to the market, empowering individuals and organizations to reach new horizons of success.",
      description2: "Our team of industry experts and instructional designers is committed to creating dynamic, relevant, and impactful learning experiences. We partner with organizations to build a credentialed, future-ready workforce, equipped to thrive in an ever-evolving global market.",
      quote: "Education is the most powerful weapon you can use to change the world.",
      mission: {
        title: "Our Mission",
        description: "To provide world-class educational services that empower students to reach their full potential and become confident, capable individuals prepared for future challenges."
      },
      vision: {
        title: "Our Vision",
        description: "To be the most trusted and innovative educational agency, recognized globally for excellence in student development and successful outcomes."
      },
      values: {
        title: "Our Values",
        description: "Excellence, integrity, innovation, and a student-centered approach guide everything we do, ensuring the best outcomes for every learner."
      }
    },

    // Our Services
    ourServices: {
      title: "Our Services",
      services: [
        {
          title: "Institutional Training Program Planning",
          imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
          items: [
            "Competency Matrix Development",
            "Employee Competency Assessment",
            "Training Needs Analysis",
            "Program Planning to Enhance Competencies"
          ],
          description: "AM Certified excels in creating integrated institutional training plans using a scientific methodology. We start by developing a competency matrix for each role, then assess employee skills to identify gaps. This data-driven approach allows us to design targeted training programs that align with strategic goals, ensuring sustainable performance improvement and capacity development."
        },
        {
          title: "Training Program Implementation",
          imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
          items: [
            "Specialized training trips with international partners",
            "Virtual remote sessions",
            "In-person sessions in equipped training halls",
            "Hybrid (in-person and remote)"
          ],
          description: "We deliver high-impact training programs in various formats. Our offerings include immersive learning trips with global partners, dynamic virtual sessions using cutting-edge technology, and fully-equipped in-person workshops. Our partnerships with leading international training centers enable us to provide a comprehensive training experience with a tangible impact on institutional performance."
        },
        {
          title: "Support in Training Program Application",
          imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
          items: [
            "Consulting Sector"
          ],
          description: "Our support extends beyond program delivery. Through our specialized consulting team, we help organizations apply learned concepts to the real world. We work with trainees to transform knowledge into effective operational practices, ensuring that training leads to sustainable improvements in efficiency and contributes to long-term institutional development."
        }
      ]
    },
    
    // Specialized Programs
    specializedPrograms: {
        previewTitle: "Explore Our Specialized Programs",
        previewSubtitle: "A curated selection of our certification tracks. Click the arrows to navigate.",
        title: "The Specialized Programs",
        categories: [
            { title: "MANAGEMENT", imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop", programs: ["Leadership Insights on Leading Vision", "Influence & persuasion", "Mindfulness", "Running a team debrief", "Leading others through conflict", "Live broadcast & recorded events from industry leaders", "Books", "Self-assessments"] },
            { title: "BUSINESS DEVELOPMENT", imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop", programs: ["CBDM® Certified Business Development Manager", "Certified Sales Professional (CSP)"] },
            { title: "CONTRACTS/CLAIM", imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop", programs: ["Certified Professional Contract Manager™ (CPCM)"] },
            { title: "RISK MANAGEMENT", imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop", programs: ["RISK Management Professional - PMI", "ISO 31000"] },
            { title: "SUSTAINABILITY", imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop", programs: ["ISO 26000", "LEED certification", "ISO 14001"] },
            { title: "SUPPLY CHAIN", imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?q=80&w=2070&auto=format&fit=crop", programs: ["Planning and Inventory Management (CPIM)", "Certified Supply Chain Professional (CSCP)", "Certified in Logistics, Transportation, and Distribution (CLTD)"] },
            { title: "FINANCE / ACCOUNTANT", imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop", programs: ["Certified Public Accountant CPA", "Certified Financial Planner CFP", "Certified Management Accountant (CMA)", "Chartered Financial Analyst CFA"] },
            { title: "HEALTH AND SAFETY", imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop", programs: ["ISO45001 Lead Auditor/ Internal Auditor", "ISO 14001 Lead Auditor/ Internal Auditor", "OSHA (30 Hr / 45 Hr)", "IOSH (Managing Safely / Working Safely)", "NEBOSH (IGC)"] },
            { title: "HUMAN RESOURCES", imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1932&auto=format&fit=crop", programs: ["Human Resource Certification Institute (HRCI)", "Society for Human Resource Management SHRM", "Chartered Institute of Personnel Development (CIPD)"] },
            { title: "QUALITY MANAGEMENT", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop", programs: ["ISO 9001 Lead Auditor/ Internal Auditor", "Certified Quality Inspector", "Certified Quality Engineer", "Certified Quality Manager", "6-SIGMA (Green belt and Black belt)"] },
            { title: "PLANNING", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", programs: ["Primavera"] },
            { title: "COST CONTROL", imageUrl: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?q=80&w=2070&auto=format&fit=crop", programs: ["Project Management Professional", "AGILE CERTIFIED PRACTITIONER (PMI-ACP)", "PRINCE2 FOUNDATION"] },
            { title: "CONSTRUCTION MANAGEMENT", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop", programs: ["Perp course for Certified Construction Manager", "Professional construction manager certificat CCM"] },
            { title: "TECHNICAL ENGINEERS", imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2070&auto=format&fit=crop", programs: ["Engineering Management Certification", "Fundamentals (EMCF)", "LEED AP Building Design + Construction (LEED)", "Professional Engineering Manager (PEM)", "BIM- Revit"] },
            { title: "SITE ENGINEER", imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop", programs: ["FE : Fundamentals of engineering exam", "PE : Professional engineering exam"] },
            { title: "COMMUNICATIONS", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop", programs: ["Communicating with confidence", "The art & science of communication", "Making an impact with non-verbal communication", "Trust building through effective communication", "Become a great listener", "Capturing the attention of senior executives"] },
            { title: "MANAGING CONFLICT", imageUrl: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=2070&auto=format&fit=crop", programs: ["Leading others through conflict", "Leadership insights on conflict management", "Understanding & resolving conflict for productive working relationships", "How to use & manage conflict to reach greater levels of success", "Leading the Unleadable"] },
            { title: "ANALYTICS", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", programs: ["Effective business analysis", "Big data fundamentals", "Data interpretation", "Business activities & tools"] },
            { title: "LEGAL", imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop", programs: ["Certified Legal Professional (CLP)"] },
            { title: "IT", imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2072&auto=format&fit=crop", programs: ["Certified information systems security professional (CISSP)", "Cisco Certified Network Associate", "Microsoft Certified Solutions Associate (MCSA)"] }
        ]
    },

    // AI Proficient Team -> Why Choose Us
    aiProficientTitle: "Your Strategic Certification Partner.",
    aiProficientSubtitle: "We don't just train; we certify. Our end-to-end service ensures your investment translates into a demonstrably skilled and credentialed workforce.",
    aiProficientButton: "Partner With Us",

    // Footer
    footerTitle: "Start Your Organization's Transformation Today.",
    footerSubtitle: "Let's build a certification strategy that unlocks your team's full potential.",
    startJourney: "Request a Proposal",
    coursinity: "I am Certified",
    coursinityDesc: "Your expert educational agency for corporate certification programs.",
    solutions: "Services",
    company: "Company",
    contact: "Contact",
    email: "info@roadmap.casa",
    phone: ["+966542398764", "+966502234319", "+966597676880"],
    footerLinks: {
        solutions: ["Program Design", "Training Delivery", "Implementation Support", "Specialized Programs"],
        company: ["About Us", "Contact", "Partnerships"],
    },
    terms: "Terms",
    privacy: "Privacy",
    cookies: "Cookies",
    rights: "© 2025 I am Certified. All rights reserved.",

    // Consultation Modal
    consultationModal: {
      readyTitle: "Ready When You Are",
      readySubtitle: "Take a sneak peek on what our personalized training can really do.",
      testimonialCompany: "Bahri company",
      testimonialText: "'I am Certified' helped us train over 4,000 employees without disrupting daily operations. The academy reflected our identity and values and the results were measurable from the first month.",
      testimonialAuthor: "M. Ali",
      testimonialRole: "Training Lead, Bahri",
      responseMessage: "You'll hear from us within 24 hours. Humans only.",
      
      firstNameLabel: "First Name *",
      firstNamePlaceholder: "What should we call you?",
      lastNameLabel: "Last Name *",
      lastNamePlaceholder: "Your last name",
      emailLabel: "Business Email *",
      emailPlaceholder: "Where can we reach you?",
      phoneLabel: "Phone Number *",
      phonePlaceholder: "+966 5X XXX XXXX",
      companyNameLabel: "Company Name *",
      companyNamePlaceholder: "Your organization's name",
      jobTitleLabel: "Job Title *",
      jobTitlePlaceholder: "Your role or position",
      employeesLabel: "Number of Employees *",
      employeesOptions: ["1-50", "51-200", "201-1000", "1001-5000", "5000+"],
      areasLabel: "Areas of Interest *",
      areasPlaceholder: "What you'd like to focus on",
      areasOptions: [
        "Launching Digital Academy",
        "Launching Learning Journeys",
        "Building An LMS",
        "AI Transformation",
        "Executive Enablement",
        "Compliance & Regulatory Training",
        "Multilingual Workforce Training",
        "Building Customized Content",
      ],
      infoLabel: "Additional Information",
      infoPlaceholder: "Anything specific we should know?",
      agreeText: "I agree to the",
      termsLink: "Terms of Service",
      and: "and",
      privacyLink: "Privacy Policy",
      submitButton: "Let's Talk",
    },

    // Terms Page
    termsPage: {
      title: "Terms and Conditions",
      lastUpdated: "Last Updated: July 26, 2024",
      sections: [
        {
          title: "1. Introduction",
          content: [
            "Welcome to I am Certified ('we', 'us', or 'our'). These Terms and Conditions govern your use of our website and services (collectively, the 'Service'). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service."
          ]
        },
        {
          title: "2. User Accounts",
          content: [
            "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.",
            "You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party."
          ]
        },
        {
          title: "3. Content",
          content: [
            "Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ('Content'). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.",
            "By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. We do not claim ownership of your Content."
          ]
        },
        {
          title: "4. Prohibited Activities",
          content: [
            "You agree not to use the Service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts; to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others."
          ]
        },
        {
          title: "5. Intellectual Property",
          content: [
            "The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of I am Certified and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries."
          ]
        },
        {
          title: "6. Termination",
          content: [
            "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
            "Upon termination, your right to use the Service will immediately cease."
          ]
        },
        {
          title: "7. Disclaimer of Warranties; Limitation of Liability",
          content: [
            "The service is provided on an 'AS IS' and 'AS AVAILABLE' basis. We do not warrant that the results of using the service will be accurate or reliable.",
            "In no case shall I am Certified, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind."
          ]
        },
        {
          title: "8. Governing Law",
          content: [
            "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions."
          ]
        },
        {
          title: "9. Changes to Terms",
          content: [
            "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms."
          ]
        },
        {
          title: "10. Contact Us",
          content: [
            "If you have any questions about these Terms, please contact us at info@roadmap.casa."
          ]
        }
      ]
    },

    // Privacy Page
    privacyPage: {
      title: "Data Security & Privacy Policy",
      lastUpdated: "Last Updated: July 26, 2024",
      sections: [
        {
          title: "1. Introduction",
          content: [
            "I am Certified ('we', 'us', or 'our') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site."
          ]
        },
        {
          title: "2. Information We Collect",
          content: [
            "We may collect information about you in a variety of ways. The information we may collect on the Site includes:",
            "Personal Data: Personally identifiable information, such as your name, email address, that you voluntarily give to us when you register with the Site.",
            "Usage Data: Information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device. This may include your computer's IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other diagnostic data.",
            "User Content: We collect the files and content you upload to our services to provide you with the features of the application, such as the Research Copilot and Interior Designer."
          ]
        },
        {
          title: "3. How We Use Your Information",
          content: [
            "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:",
            "Create and manage your account.",
            "Provide, operate, and maintain our services.",
            "Improve, personalize, and expand our services.",
            "Understand and analyze how you use our services.",
            "Communicate with you, either directly or through one of our partners, for customer service, to provide you with updates and other information relating to the website."
          ]
        },
        {
          title: "4. Disclosure of Your Information",
          content: [
            "We do not share, sell, rent, or trade user information with third parties for their commercial purposes. We may share information we have collected about you in certain situations, such as with third-party service providers who perform services for us or on our behalf, including data analysis, hosting services, and customer service."
          ]
        },
        {
          title: "5. Data Security",
          content: [
            "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse."
          ]
        },
        {
          title: "6. Your Data Protection Rights",
          content: [
            "Depending on your location, you may have the following rights regarding your personal information: the right to access, the right to rectification, the right to erasure, the right to restrict processing, and the right to data portability. You can manage your account information by logging into your account settings."
          ]
        },
        {
          title: "7. Children's Privacy",
          content: [
            "Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13."
          ]
        },
        {
          title: "8. Changes to This Privacy Policy",
          content: [
            "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes."
          ]
        },
        {
          title: "9. Contact Us",
          content: [
            "If you have any questions about this Privacy Policy, please contact us at info@roadmap.casa."
          ]
        }
      ]
    },

    // Cookies Page
    cookiesPage: {
      title: "Cookie Policy",
      lastUpdated: "Last Updated: July 1, 2025",
      introduction: [
        "This Cookie Policy explains how I am Certified ('we', 'us', or 'our') uses cookies and similar technologies to collect and process information when you visit our websites, our training platforms, or any of our digital services that link to this policy.",
        "This policy includes an explanation of what these technologies are, why we use them, and how you can manage your preferences regarding them.",
        "For more information on how we handle personal data, please refer to our [Privacy Policy]."
      ],
      sections: [
        {
          title: "What are Cookies?",
          content: [
            "Cookies are small text files stored in your browser or on your device when you visit a website. These files are used to remember your preferences, improve site functionality, and understand how you interact with our platforms. These files may be first-party (set by us) or third-party (set by analytics providers or social media platforms)."
          ]
        },
        {
          title: "Types of Cookies We Use",
          content: [
            "We use session (temporary) and persistent (long-term) cookies within the I am Certified academy:",
            "1. Necessary Cookies (Essential): Essential for the operation of the website and academy, enabling basic functions like page navigation, account access, and joining training courses.",
            "2. Performance and Analytics Cookies: Help us understand how users interact with our site, such as identifying the most visited training modules or points of withdrawal from training content. We use analytics tools to measure usage in aggregate and improve the user experience.",
            "3. Functionality and Personalization Cookies: Used to provide advanced features such as saving language preferences, resuming training from where you left off, and customizing the user interface.",
            "4. Advertising and Marketing Cookies: Used to deliver relevant ads and measure the performance of marketing campaigns. They help display training solutions that may be of interest to you, based on your browsing behavior both on and off our platform.",
            "5. Third-Party Cookies: Third parties such as LinkedIn, Meta (Facebook), and YouTube may set cookies through embedded content or their marketing tools. These cookies are subject to the privacy policies of those parties."
          ]
        },
        {
          title: "How We Use Cookies",
          content: [
            "Our cookies are used for the following purposes:",
            "Securing user sessions during login and assessments.",
            "Saving your progress and preferences within training paths.",
            "Measuring engagement with training modules.",
            "Improving academy performance and usability.",
            "Personalizing the training experience and support services.",
            "Providing content and recommendations that match your goals."
          ]
        },
        {
          title: "Managing Your Cookie Preferences",
          content: [
            "You can manage your cookie settings in several ways:",
            "1. On-site Consent Tool: On your first visit to the I am Certified website and academy, a cookie banner will appear, allowing you to accept all cookies or customize your preferences. You can change these settings at any time through the 'Manage Cookies' option in the site footer.",
            "2. Browser Settings: Most browsers allow users to block or delete cookies. However, please be aware that disabling some of these cookies may affect the functionality of the site or learning tools.",
            "3. 'Do Not Track' and Global Privacy Control: I am Certified supports Do Not Track browser signals and Global Privacy Control (GPC) standards where legally required. These settings can automatically reject certain cookies if enabled on your devices."
          ]
        },
        {
          title: "Other Tracking Technologies",
          content: [
            "In addition to cookies, we use other technologies such as web beacons (tracking pixels) and local storage to:",
            "Monitor open rates of training notification emails.",
            "Analyze interaction within interactive training simulations.",
            "Maintain an active session during assessments.",
            "These tools work similarly to cookies and contribute to providing an integrated and seamless training experience."
          ]
        },
        {
          title: "Contact Us",
          content: [
            "If you have any questions about this policy or wish to exercise your rights under data protection regulations, please contact us via the following email: info@roadmap.casa."
          ]
        }
      ]
    },
  },
  [Language.AR]: {
    // Header
    navServices: "خدماتنا",
    navSpecializedPrograms: "البرامج التخصصية",
    bookDemo: "احجز استشارة",

    // Hero
    heroTitle: "صادق على خبرة فريقك. نحن نبني الطريق إلى الاعتماد.",
    heroSubtitle: "بصفتنا شريككم كوكالة تعليمية، نحن متخصصون في تصميم وتقديم ودعم برامج تدريبية شاملة تؤدي إلى شهادات معترف بها.",
    heroButton: "ابدأ الآن",

    // Partners
    partnersSection: {
      title: "موثوق به من قبل المنظمات الرائدة",
      subtitle: "شراكاتنا تضمن أعلى مستويات التعليم والاعتراف العالمي",
      cards: [
        { title: "شبكة الجامعات العالمية", icon: "BuildingOfficeIcon" },
        { title: "المجلس الدولي للتعليم", icon: "BookOpenIcon" },
        { title: "التحالف العالمي للتعليم", icon: "GlobeAltIcon" },
        { title: "معهد التدريب المهني", icon: "BriefcaseIcon" }
      ]
    },
    
    // About Us
    aboutUs: {
      tag: "من نحن",
      title1: "رواد الطريق في",
      title2: "التميز التعليمي",
      description1: "كقوة جديدة في المشهد التعليمي، نكرس جهودنا لإعادة تعريف التطوير المهني. نصمم ونقدم برامج اعتماد مبتكرة تضيف قيمة ملموسة للسوق، وتمكن الأفراد والمؤسسات من الوصول إلى آفاق جديدة من النجاح.",
      description2: "يلتزم فريقنا من خبراء الصناعة ومصممي التعليم بإنشاء تجارب تعليمية ديناميكية وملائمة ومؤثرة. نتشارك مع المؤسسات لبناء قوة عاملة معتمدة ومستعدة للمستقبل، ومجهزة للازدهار في سوق عالمي دائم التطور.",
      quote: "التعليم هو أقوى سلاح يمكنك استخدامه لتغيير العالم.",
      mission: {
        title: "مهمتنا",
        description: "تقديم خدمات تعليمية عالمية المستوى تمكن الطلاب من الوصول إلى إمكاناتهم الكاملة وأن يصبحوا أفرادًا واثقين وقادرين ومستعدين لتحديات المستقبل."
      },
      vision: {
        title: "رؤيتنا",
        description: "أن نكون الوكالة التعليمية الأكثر ثقة وابتكارًا، معترف بها عالميًا للتميز في تطوير الطلاب وتحقيق النتائج الناجحة."
      },
      values: {
        title: "قيمنا",
        description: "التميز والنزاهة والابتكار والنهج الذي يركز على الطالب يوجه كل ما نقوم به، مما يضمن أفضل النتائج لكل متعلم."
      }
    },

    // Our Services
    ourServices: {
      title: "خدماتنا",
      services: [
        {
          title: "تخطيط برامج التدريب للمؤسسات",
          imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
          items: [
            "إعداد مصفوفة الجدارات",
            "تقييم جدارات الموظفين",
            "تحديد الإحتياجات التدريبية",
            "تخطيط البرامج التدريبية لرفع جدارات الموظفين"
          ],
          description: "يتميز مركز AM Certified بقدرته المتكاملة على صياغة وتطوير الخطط التدريبية المؤسسية وفق منهجية علمية ومنظمة. نبدأ بإعداد مصفوفة الجدارات لكل وظيفة، ثم نقيم مهارات الموظفين لتحديد الفجوات. هذا النهج القائم على البيانات يمكننا من تصميم برامج تدريبية موجهة تتوافق مع الأهداف الاستراتيجية، مما يضمن تحسينًا مستدامًا للأداء وتنمية القدرات."
        },
        {
          title: "تنفيذ برامج التدريب",
          imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
          items: [
            "رحلات تدريب خاصة مع شركائنا بالخارج",
            "افتراضي عن بعد",
            "حضوري في قاعات تدريب مجهزة",
            "حضوري وعن بعد"
          ],
          description: "نحن نقدم برامج تدريبية عالية التأثير بأشكال متنوعة. تشمل عروضنا رحلات تعليمية غامرة مع شركاء عالميين، وجلسات افتراضية ديناميكية باستخدام أحدث التقنيات، وورش عمل حضورية مجهزة بالكامل. تمكننا شراكاتنا مع مراكز التدريب الدولية الرائدة من تقديم تجربة تدريبية شاملة ذات تأثير ملموس على أداء المؤسسة."
        },
        {
          title: "الدعم في تطبيق البرامج التدريبية",
          imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
          items: [
            "قطاع الاستشارات"
          ],
          description: "يمتد دعمنا إلى ما بعد تقديم البرامج. من خلال فريقنا الاستشاري المتخصص، نساعد المؤسسات على تطبيق المفاهيم المكتسبة في العالم الحقيقي. نعمل مع المتدربين لتحويل المعرفة إلى ممارسات تشغيلية فعالة، مما يضمن أن التدريب يؤدي إلى تحسينات مستدامة في الكفاءة ويساهم في التطوير المؤسسي طويل الأجل."
        }
      ]
    },

    // Specialized Programs
    specializedPrograms: {
        previewTitle: "استكشف برامجنا التخصصية",
        previewSubtitle: "مجموعة مختارة من مسارات الاعتماد لدينا. انقر على الأسهم للتصفح.",
        title: "البرامج التخصصية",
        categories: [
            { title: "الإدارة", imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop", programs: ["رؤى قيادية حول قيادة الرؤية", "التأثير والإقناع", "اليقظة الذهنية", "إدارة جلسات استخلاص المعلومات للفريق", "قيادة الآخرين خلال النزاعات", "بث حي وأحداث مسجلة من قادة الصناعة", "كتب", "تقييمات ذاتية"] },
            { title: "تطوير الأعمال", imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop", programs: ["مدير تطوير أعمال معتمد (CBDM®)", "محترف مبيعات معتمد (CSP)"] },
            { title: "العقود/المطالبات", imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop", programs: ["مدير عقود محترف معتمد (CPCM)"] },
            { title: "إدارة المخاطر", imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop", programs: ["محترف إدارة المخاطر - PMI", "ISO 31000"] },
            { title: "الاستدامة", imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop", programs: ["ISO 26000", "شهادة LEED", "ISO 14001"] },
            { title: "سلاسل الإمداد", imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?q=80&w=2070&auto=format&fit=crop", programs: ["إدارة التخطيط والمخزون (CPIM)", "محترف سلسلة إمداد معتمد (CSCP)", "معتمد في الخدمات اللوجستية والنقل والتوزيع (CLTD)"] },
            { title: "المالية / المحاسبة", imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop", programs: ["محاسب قانوني معتمد (CPA)", "مخطط مالي معتمد (CFP)", "محاسب إداري معتمد (CMA)", "محلل مالي معتمد (CFA)"] },
            { title: "الصحة والسلامة", imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop", programs: ["مدقق رئيسي/داخلي ISO45001", "مدقق رئيسي/داخلي ISO 14001", "OSHA (30 ساعة / 45 ساعة)", "IOSH (الإدارة بأمان / العمل بأمان)", "NEBOSH (IGC)"] },
            { title: "الموارد البشرية", imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1932&auto=format&fit=crop", programs: ["معهد شهادات الموارد البشرية (HRCI)", "جمعية إدارة الموارد البشرية (SHRM)", "المعهد المعتمد لشؤون الموظفين والتنمية (CIPD)"] },
            { title: "إدارة الجودة", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop", programs: ["مدقق رئيسي/داخلي ISO 9001", "مفتش جودة معتمد", "مهندس جودة معتمد", "مدير جودة معتمد", "6-SIGMA (الحزام الأخضر والأسود)"] },
            { title: "التخطيط", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", programs: ["بريمافيرا"] },
            { title: "ضبط التكاليف", imageUrl: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?q=80&w=2070&auto=format&fit=crop", programs: ["محترف إدارة المشاريع", "ممارس معتمد في AGILE (PMI-ACP)", "PRINCE2 FOUNDATION"] },
            { title: "إدارة الإنشاءات", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop", programs: ["دورة تحضيرية لمدير الإنشاءات المعتمد", "شهادة مدير الإنشاءات المحترف (CCM)"] },
            { title: "المهندسون الفنيون", imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2070&auto=format&fit=crop", programs: ["شهادة إدارة الهندسة", "أساسيات (EMCF)", "LEED AP تصميم وإنشاء المباني (LEED)", "مدير هندسة محترف (PEM)", "BIM- Revit"] },
            { title: "مهندس الموقع", imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop", programs: ["FE: امتحان أساسيات الهندسة", "PE: امتحان الهندسة المهنية"] },
            { title: "الاتصالات", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop", programs: ["التواصل بثقة", "فن وعلم التواصل", "إحداث تأثير بالتواصل غير اللفظي", "بناء الثقة من خلال التواصل الفعال", "كن مستمعًا رائعًا", "جذب انتباه كبار المديرين التنفيذيين"] },
            { title: "إدارة النزاعات", imageUrl: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=2070&auto=format&fit=crop", programs: ["قيادة الآخرين خلال النزاعات", "رؤى قيادية في إدارة النزاعات", "فهم وحل النزاعات من أجل علاقات عمل منتجة", "كيفية استخدام وإدارة النزاعات لتحقيق مستويات نجاح أكبر", "قيادة من لا يمكن قيادتهم"] },
            { title: "التحليلات", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", programs: ["تحليل الأعمال الفعال", "أساسيات البيانات الضخمة", "تفسير البيانات", "أنشطة وأدوات الأعمال"] },
            { title: "الشؤون القانونية", imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop", programs: ["محترف قانوني معتمد (CLP)"] },
            { title: "تقنية المعلومات", imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2072&auto=format&fit=crop", programs: ["محترف أمن نظم المعلومات المعتمد (CISSP)", "مساعد شبكات معتمد من سيسكو", "مساعد حلول معتمد من مايكروسوفت (MCSA)"] }
        ]
    },

    // AI Proficient Team -> Why Choose Us
    aiProficientTitle: "شريككم الاستراتيجي للاعتماد.",
    aiProficientSubtitle: "نحن لا ندرب فقط؛ بل نعتمد. تضمن خدمتنا الشاملة أن استثماركم يترجم إلى قوة عاملة ماهرة ومعتمدة بشكل واضح.",
    aiProficientButton: "شارك معنا",

    // Footer
    footerTitle: "ابدأ تحول مؤسستك اليوم.",
    footerSubtitle: "دعونا نبني استراتيجية اعتماد تطلق العنان للإمكانيات الكاملة لفريقكم.",
    startJourney: "اطلب عرضًا",
    coursinity: "أنا معتمد",
    coursinityDesc: "وكالتكم التعليمية الخبيرة لبرامج الاعتماد المؤسسي.",
    solutions: "الخدمات",
    company: "الشركة",
    contact: "اتصل بنا",
    email: "info@roadmap.casa",
    phone: ["+966542398764", "+966502234319", "+966597676880"],
    footerLinks: {
        solutions: ["تصميم البرامج", "تقديم التدريب", "دعم التنفيذ", "البرامج التخصصية"],
        company: ["من نحن", "تواصل معنا", "الشراكات"],
    },
    terms: "الشروط",
    privacy: "الخصوصية",
    cookies: "الكوكيز",
    rights: "© 2025 أنا معتمد. جميع الحقوق محفوظة.",
    
    // Consultation Modal
    consultationModal: {
      readyTitle: "جاهزون عندما تكونون",
      readySubtitle: "ألقِ نظرة خاطفة على ما يمكن أن يقدمه تدريبنا المخصص.",
      testimonialCompany: "شركة بحري",
      testimonialText: "ساعدتنا 'أنا معتمد' في تدريب أكثر من 4000 موظف دون تعطيل العمليات اليومية. عكست الأكاديمية هويتنا وقيمنا وكانت النتائج قابلة للقياس من الشهر الأول.",
      testimonialAuthor: "م. علي",
      testimonialRole: "قائد التدريب، بحري",
      responseMessage: "سوف يصلك ردنا في غضون 24 ساعة. من فريقنا البشري.",

      firstNameLabel: "الاسم الأول *",
      firstNamePlaceholder: "ماذا يجب أن نناديك؟",
      lastNameLabel: "اسم العائلة *",
      lastNamePlaceholder: "اسم عائلتك",
      emailLabel: "البريد الإلكتروني للأعمال *",
      emailPlaceholder: "أين يمكننا الوصول إليك؟",
      phoneLabel: "رقم الهاتف *",
      phonePlaceholder: " XXXX XXX 5X 966+",
      companyNameLabel: "اسم الشركة *",
      companyNamePlaceholder: "اسم مؤسستك",
      jobTitleLabel: "المسمى الوظيفي *",
      jobTitlePlaceholder: "دورك أو منصبك",
      employeesLabel: "عدد الموظفين *",
      employeesOptions: ["1-50", "51-200", "201-1000", "1001-5000", "5000+"],
      areasLabel: "مجالات الاهتمام *",
      areasPlaceholder: "ما الذي تود التركيز عليه؟",
      areasOptions: [
        "إطلاق أكاديمية رقمية",
        "إطلاق رحلات تعليمية",
        "بناء نظام إدارة تعلم (LMS)",
        "التحول باستخدام الذكاء الاصطناعي",
        "تمكين القيادات التنفيذية",
        "التدريب على الامتثال والتنظيمات",
        "تدريب القوى العاملة متعددة اللغات",
        "بناء محتوى مخصص",
      ],
      infoLabel: "معلومات إضافية",
      infoPlaceholder: "هل هناك أي شيء محدد يجب أن نعرفه؟",
      agreeText: "أوافق على",
      termsLink: "شروط الخدمة",
      and: "و",
      privacyLink: "سياسة الخصوصية",
      submitButton: "لنتحدث",
    },

    // Terms Page
    termsPage: {
      title: "الشروط والأحكام",
      lastUpdated: "آخر تحديث: 26 يوليو 2024",
      sections: [
        {
          title: "1. مقدمة",
          content: [
            "مرحبًا بكم في 'أنا معتمد' ('نحن'، 'لنا'، أو 'خاصتنا'). تحكم هذه الشروط والأحكام استخدامك لموقعنا وخدماتنا (يشار إليها مجتمعة بـ 'الخدمة'). من خلال الوصول إلى الخدمة أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك الوصول إلى الخدمة."
          ]
        },
        {
          title: "2. حسابات المستخدمين",
          content: [
            "عند إنشاء حساب معنا، يجب عليك تقديم معلومات دقيقة وكاملة وحديثة في جميع الأوقات. يشكل عدم القيام بذلك خرقًا للشروط، مما قد يؤدي إلى الإنهاء الفوري لحسابك على خدمتنا.",
            "أنت مسؤول عن حماية كلمة المرور التي تستخدمها للوصول إلى الخدمة وعن أي أنشطة أو إجراءات تتم بموجب كلمة المرور الخاصة بك. أنت توافق على عدم الكشف عن كلمة المرور الخاصة بك لأي طرف ثالث."
          ]
        },
        {
          title: "3. المحتوى",
          content: [
            "تسمح لك خدمتنا بنشر وربط وتخزين ومشاركة وإتاحة معلومات معينة أو نصوص أو رسومات أو مواد أخرى ('المحتوى'). أنت مسؤول عن المحتوى الذي تنشره على الخدمة، بما في ذلك قانونيته وموثوقيته وملاءمته.",
            "من خلال نشر المحتوى على الخدمة، فإنك تمنحنا الحق والترخيص لاستخدام هذا المحتوى وتعديله وأدائه علنًا وعرضه علنًا واستنساخه وتوزيعه على ومن خلال الخدمة. نحن لا ندعي ملكية المحتوى الخاص بك."
          ]
        },
        {
          title: "4. الأنشطة المحظورة",
          content: [
            "أنت توافق على عدم استخدام الخدمة لأي غرض غير قانوني أو لحث الآخرين على أداء أو المشاركة في أي أعمال غير قانونية؛ لانتهاك أي لوائح أو قواعد أو قوانين أو مراسيم دولية أو فيدرالية أو إقليمية أو محلية؛ لانتهاك حقوق الملكية الفكرية الخاصة بنا أو حقوق الملكية الفكرية للآخرين."
          ]
        },
        {
          title: "5. الملكية الفكرية",
          content: [
            "الخدمة ومحتواها الأصلي (باستثناء المحتوى المقدم من قبل المستخدمين) وميزاتها ووظائفها هي وستبقى ملكية حصرية لـ 'أنا معتمد' ومرخصيها. الخدمة محمية بموجب حقوق النشر والعلامات التجارية والقوانين الأخرى في كل من الولايات المتحدة والدول الأجنبية."
          ]
        },
        {
          title: "6. الإنهاء",
          content: [
            "يجوز لنا إنهاء حسابك أو تعليقه على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب من الأسباب، بما في ذلك على سبيل المثال لا الحصر إذا انتهكت الشروط.",
            "عند الإنهاء، سيتوقف حقك في استخدام الخدمة على الفور."
          ]
        },
        {
          title: "7. إخلاء المسؤولية عن الضمانات؛ تحديد المسؤولية",
          content: [
            "يتم توفير الخدمة على أساس 'كما هي' و 'كما هي متاحة'. نحن لا نضمن أن نتائج استخدام الخدمة ستكون دقيقة أو موثوقة.",
            "لا تتحمل 'أنا معتمد' أو مديرونا أو مسؤولينا أو موظفونا أو الشركات التابعة لنا أو وكلائنا أو مقاولونا أو متدربونا أو موردونا أو مقدمو الخدمات أو المرخصون بأي حال من الأحوال المسؤولية عن أي إصابة أو خسارة أو مطالبة أو أي أضرار مباشرة أو غير مباشرة أو عرضية أو عقابية أو خاصة أو تبعية من أي نوع."
          ]
        },
        {
          title: "8. القانون الحاكم",
          content: [
            "تخضع هذه الشروط وتفسر وفقًا لقوانين الولاية القضائية التي تأسست فيها شركتنا، بغض النظر عن تعارضها مع أحكام القانون."
          ]
        },
        {
          title: "9. التغييرات على الشروط",
          content: [
            "نحن نحتفظ بالحق، وفقًا لتقديرنا الخاص، في تعديل أو استبدال هذه الشروط في أي وقت. سنقدم إشعارًا قبل 30 يومًا على الأقل من سريان أي شروط جديدة. من خلال الاستمرار في الوصول إلى خدمتنا أو استخدامها بعد أن تصبح هذه المراجعات سارية المفعول، فإنك توافق على الالتزام بالشروط المعدلة."
          ]
        },
        {
          title: "10. اتصل بنا",
          content: [
            "إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على info@roadmap.casa."
          ]
        }
      ]
    },

    // Privacy Page
    privacyPage: {
      title: "سياسة أمن وخصوصية البيانات",
      lastUpdated: "آخر تحديث: 26 يوليو 2024",
      sections: [
        {
          title: "1. مقدمة",
          content: [
            "يلتزم 'أنا معتمد' ('نحن'، 'لنا'، أو 'خاصتنا') بحماية خصوصيتك. تشرح سياسة الخصوصية هذه كيف نجمع معلوماتك ونستخدمها ونكشف عنها ونحميها عند استخدامك لخدمتنا. يرجى قراءة سياسة الخصوصية هذه بعناية. إذا كنت لا توافق على شروط سياسة الخصوصية هذه، يرجى عدم الوصول إلى الموقع."
          ]
        },
        {
          title: "2. المعلومات التي نجمعها",
          content: [
            "قد نجمع معلومات عنك بعدة طرق. تتضمن المعلومات التي قد نجمعها على الموقع ما يلي:",
            "البيانات الشخصية: معلومات التعريف الشخصية، مثل اسمك وعنوان بريدك الإلكتروني، التي تقدمها لنا طواعية عند التسجيل في الموقع.",
            "بيانات الاستخدام: المعلومات التي يرسلها متصفحك كلما قمت بزيارة خدمتنا أو عند الوصول إلى الخدمة عن طريق أو من خلال جهاز محمول. قد يشمل ذلك عنوان IP لجهاز الكمبيوتر الخاص بك، ونوع المتصفح، وإصدار المتصفح، وصفحات خدمتنا التي تزورها، ووقت وتاريخ زيارتك، وبيانات تشخيصية أخرى.",
            "محتوى المستخدم: نقوم بجمع الملفات والمحتوى الذي تقوم بتحميله على خدماتنا لتزويدك بميزات التطبيق، مثل مساعد البحث ومصمم الديكور الداخلي."
          ]
        },
        {
          title: "3. كيف نستخدم معلوماتك",
          content: [
            "إن امتلاك معلومات دقيقة عنك يسمح لنا بتزويدك بتجربة سلسة وفعالة ومخصصة. على وجه التحديد، قد نستخدم المعلومات التي تم جمعها عنك عبر الموقع من أجل:",
            "إنشاء وإدارة حسابك.",
            "توفير وتشغيل وصيانة خدماتنا.",
            "تحسين خدماتنا وتخصيصها وتوسيعها.",
            "فهم وتحليل كيفية استخدامك لخدماتنا.",
            "التواصل معك، إما مباشرة أو من خلال أحد شركائنا، لخدمة العملاء، لتزويدك بالتحديثات والمعلومات الأخرى المتعلقة بالموقع."
          ]
        },
        {
          title: "4. الكشف عن معلوماتك",
          content: [
            "نحن لا نشارك أو نبيع أو نؤجر أو نتاجر بمعلومات المستخدم مع أطراف ثالثة لأغراضهم التجارية. قد نشارك المعلومات التي جمعناها عنك في مواقف معينة، كما هو الحال مع مزودي الخدمات من الأطراف الثالثة الذين يؤدون خدمات لنا أو نيابة عنا، بما في ذلك تحليل البيانات وخدمات الاستضافة وخدمة العملاء."
          ]
        },
        {
          title: "5. أمن البيانات",
          content: [
            "نحن نستخدم تدابير أمنية إدارية وتقنية ومادية للمساعدة في حماية معلوماتك الشخصية. بينما اتخذنا خطوات معقولة لتأمين المعلومات الشخصية التي تقدمها لنا، يرجى العلم أنه على الرغم من جهودنا، لا توجد تدابير أمنية مثالية أو لا يمكن اختراقها، ولا يمكن ضمان أي طريقة لنقل البيانات ضد أي اعتراض أو أي نوع آخر من سوء الاستخدام."
          ]
        },
        {
          title: "6. حقوق حماية البيانات الخاصة بك",
          content: [
            "اعتمادًا على موقعك، قد يكون لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية: الحق في الوصول، والحق في التصحيح، والحق في المسح، والحق في تقييد المعالجة، والحق في نقل البيانات. يمكنك إدارة معلومات حسابك عن طريق تسجيل الدخول إلى إعدادات حسابك."
          ]
        },
        {
          title: "7. خصوصية الأطفال",
          content: [
            "خدمتنا لا تخاطب أي شخص يقل عمره عن 13 عامًا. نحن لا نجمع عن قصد معلومات تعريف شخصية من أي شخص يقل عمره عن 13 عامًا."
          ]
        },
        {
          title: "8. التغييرات على سياسة الخصوصية هذه",
          content: [
            "قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة. ننصحك بمراجعة سياسة الخصوصية هذه بشكل دوري لأي تغييرات."
          ]
        },
        {
          title: "9. اتصل بنا",
          content: [
            "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على info@roadmap.casa."
          ]
        }
      ]
    },

    // Cookies Page
    cookiesPage: {
      title: "سياسة ملفات تعريف الارتباط (Cookies)",
      lastUpdated: "آخر تحديث: 1 يوليو 2025",
      introduction: [
        "توضح سياسة ملفات تعريف الارتباط هذه كيفية استخدام 'أنا معتمد' ('نحن' أو 'لنا') لملفات تعريف الارتباط والتقنيات المماثلة لجمع ومعالجة المعلومات عند زيارتكم لمواقعنا الإلكترونية، أو منصات التدريب الخاصة بنا، أو أي من خدماتنا الرقمية التي ترتبط بهذه السياسة.",
        "تتضمن هذه السياسة توضيحاً لماهية هذه التقنيات، وأسباب استخدامها، والطريقة التي يمكنكم من خلالها إدارة تفضيلاتكم بشأنها.",
        "للمزيد من المعلومات حول كيفية تعاملنا مع البيانات الشخصية، يُرجى الرجوع إلى [سياسة الخصوصية]."
      ],
      sections: [
        {
          title: "أولاً: ما هي ملفات تعريف الارتباط (Cookies)؟",
          content: [
            "ملفات تعريف الارتباط هي ملفات نصية صغيرة تُخزَّن في متصفحكم أو على جهازكم عند زيارة أحد المواقع الإلكترونية. وتُستخدم هذه الملفات لتذكّر تفضيلاتكم، وتحسين وظائف الموقع، وفهم كيفية تفاعلكم مع منصاتنا. وقد تكون هذه الملفات من الطرف الأول (يتم إعدادها من قبلنا)، أو من الطرف الثالث (يتم إعدادها من قبل مزوّدي التحليلات أو منصات التواصل الاجتماعي)."
          ]
        },
        {
          title: "ثانياً: أنواع ملفات تعريف الارتباط التي نستخدمها",
          content: [
            "نستخدم ملفات تعريف الارتباط المؤقتة (خاصة بالجلسة) والدائمة (طويلة الأمد) ضمن أكاديمية 'أنا معتمد':",
            "1. ملفات تعريف الارتباط الضرورية (الأساسية): ضرورية لتشغيل الموقع والأكاديمية، وتُمكّن من الوظائف الأساسية مثل التنقّل بين الصفحات، الوصول إلى الحسابات، والانضمام إلى الدورات التدريبية.",
            "2. ملفات الأداء والتحليلات: تُساعدنا على فهم كيفية تفاعل المستخدمين مع موقعنا، مثل تحديد الوحدات التدريبية الأكثر زيارة، أو نقاط الانسحاب من المحتوى التدريبي. نستخدم أدوات تحليلية لقياس الاستخدام بشكل إجمالي وتحسين تجربة المستخدم.",
            "3. ملفات الوظائف والتخصيص: تُستخدم لتوفير ميزات متقدّمة مثل حفظ تفضيلات اللغة، استئناف التدريب من النقطة التي توقفت عندها، وتخصيص واجهة المستخدم حسب المستخدم.",
            "4. ملفات الإعلانات والتسويق: تُستخدم لتقديم إعلانات ذات صلة وقياس أداء الحملات التسويقية. وتُساهم في عرض حلول تدريبية قد تكون ذات اهتمام لكم، استناداً إلى سلوك تصفحكم داخل منصتنا وخارجها.",
            "5. ملفات الطرف الثالث: قد تقوم جهات خارجية مثل LinkedIn وMeta (Facebook) وYouTube بتعيين ملفات تعريف ارتباط من خلال محتوى مضمّن أو أدوات تسويق تابعة لهم. وتخضع هذه الملفات لسياسات الخصوصية الخاصة بتلك الجهات."
          ]
        },
        {
          title: "ثالثاً: كيفية استخدامنا لملفات تعريف الارتباط",
          content: [
            "تُستخدم ملفات تعريف الارتباط لدينا للأغراض التالية:",
            "تأمين جلسات المستخدم أثناء تسجيل الدخول والتقييمات.",
            "حفظ تقدمكم وتفضيلاتكم ضمن المسارات التدريبية.",
            "قياس التفاعل مع الوحدات التدريبية.",
            "تحسين أداء الأكاديمية وسهولة الاستخدام.",
            "تخصيص التجربة التدريبية وخدمات الدعم.",
            "تقديم محتوى وتوصيات تتناسب مع أهدافكم."
          ]
        },
        {
          title: "رابعاً: إدارة تفضيلات ملفات تعريف الارتباط",
          content: [
            "يمكنكم إدارة إعدادات ملفات تعريف الارتباط بعدة طرق:",
            "1. أداة الموافقة داخل الموقع: عند زيارتكم الأولى لموقع وأكاديمية 'أنا معتمد'، ستظهر لافتة لملفات تعريف الارتباط تتيح لكم قبول جميع الملفات أو تخصيص تفضيلاتكم. يمكنكم تعديل هذه الإعدادات في أي وقت من خلال خيار 'إدارة ملفات تعريف الارتباط' في تذييل الموقع.",
            "2. إعدادات المتصفح: تسمح معظم المتصفحات للمستخدمين بحظر أو حذف ملفات تعريف الارتباط. ولكن يرجى العلم أن إيقاف بعض هذه الملفات قد يؤثر على وظائف الموقع أو أدوات التعلم.",
            "3. إعدادات 'عدم التتبع' والتحكّم العالمي بالخصوصية: تدعم 'أنا معتمد' إشارات المتصفح الخاصة بعدم التتبع (Do Not Track) ومعايير التحكّم العالمي في الخصوصية (GPC) عندما يكون ذلك مطلوباً قانوناً. ويمكن لهذه الإعدادات رفض ملفات معينة بشكل تلقائي في حال تفعيلها على أجهزتكم."
          ]
        },
        {
          title: "خامساً: تقنيات تتبّع أخرى",
          content: [
            "بالإضافة إلى ملفات تعريف الارتباط، نستخدم بعض التقنيات الأخرى مثل إشارات الويب (tracking pixels) والتخزين المحلي (Local Storage) بهدف:",
            "مراقبة معدلات فتح رسائل البريد الخاصة بالإشعارات التدريبية.",
            "تحليل التفاعل داخل المحاكاة التدريبية التفاعلية.",
            "الحفاظ على الجلسة النشطة خلال أداء التقييمات.",
            "تعمل هذه الأدوات بطريقة مشابهة لملفات تعريف الارتباط وتُسهم في تقديم تجربة تدريبية متكاملة وسلسة."
          ]
        },
        {
          title: "سادساً: التواصل معنا",
          content: [
            "في حال وجود أي استفسار بخصوص هذه السياسة أو لرغبتكم في ممارسة حقوقكم بموجب أنظمة حماية البيانات، يُرجى التواصل معنا عبر البريد الإلكتروني التالي: info@roadmap.casa."
          ]
        }
      ]
    },
  },
};
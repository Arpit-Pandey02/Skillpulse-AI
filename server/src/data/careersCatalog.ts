export interface RawCareerData {
  careerId: string;
  title: string;
  domain: string;
  summary: string;
  description: string;
  keyActivities: string[];
  workStyleTags: string[];
  environmentTags: string[];
  priorityTags: string[];
  educationRequirement: {
    level: string;
    typicalMajors: string[];
    willingnessMatch: string[];
  };
  transferableSubjects: string[];
  entryPathways: string[];
  tradeoffsAndUncertainties: string[];
  practicalMiniProjects: Array<{
    title: string;
    description: string;
    duration: string;
    type: 'mini_project' | 'intro_lesson' | 'informational_interview';
  }>;
  evidence: {
    salaryData: Array<{
      geographicScope: string;
      currency: string;
      min: number;
      median: number;
      max: number;
      period: string;
      sourceName: string;
      sourceUrl: string;
      publicationYear: number;
      socCodeOrStandard: string;
    }>;
    employmentOutlook: {
      geographicScope: string;
      growthRateText: string;
      projectedOpeningsText: string;
      sourceName: string;
      sourceUrl: string;
      publicationYear: number;
    };
    sampleRolesOrJobPostings: Array<{
      title: string;
      companyOrType: string;
      location: string;
      isIllustrativeDemo: boolean;
      sourceNote: string;
      sampleResponsibilities: string[];
    }>;
    officialBodiesAndCertifications: Array<{
      name: string;
      type: string;
      url: string;
      countryOrScope: string;
    }>;
    industryReports: Array<{
      title: string;
      publisher: string;
      year: number;
      keyInsight: string;
      citationUrl: string;
    }>;
    limitationsNote: string;
  };
}

export const CAREER_DOMAINS = [
  'Technology & Software',
  'AI, Data & Mathematics',
  'Cybersecurity & Infrastructure',
  'Healthcare & Life Sciences',
  'Business, Finance & Consulting',
  'Design & Creative Media',
  'Law, Policy & Public Service',
  'Engineering & Hardware',
  'Education, Teaching & EdTech',
  'Scientific Research',
  'Other / Emerging Fields',
];

export const CAREERS_CATALOG: RawCareerData[] = [
  // 1. Full-Stack Software Engineer
  {
    careerId: 'full-stack-software-engineer',
    title: 'Full-Stack Software Engineer',
    domain: 'Technology & Software',
    summary: 'Designs, develops, and maintains end-to-end web applications, client interfaces, backend services, and database systems.',
    description: 'Full-stack software engineers bridge user experiences and backend infrastructure. Everyday work includes architecting APIs, writing clean modular code in React/Node/TypeScript, collaborating with product designers, and optimizing cloud deployment pipelines.',
    keyActivities: [
      'Building responsive frontend user interfaces using modern frameworks',
      'Implementing secure RESTful and GraphQL backend microservices',
      'Writing automated unit, integration, and end-to-end test suites',
      'Debugging distributed systems and monitoring performance in staging/production',
    ],
    workStyleTags: ['Analytical & Logic', 'Creating things', 'Working with people'],
    environmentTags: ['Remote / Hybrid friendly', 'Collaborative agile squads', 'Fast-paced tech'],
    priorityTags: ['High Income Potential', 'Flexibility & Remote', 'Continuous Learning'],
    educationRequirement: {
      level: "Bachelor's Degree or Demonstrated Project Portfolio",
      typicalMajors: ['Computer Science', 'Software Engineering', 'Information Technology', 'Mathematics'],
      willingnessMatch: ['bachelors', 'certifications_self_taught'],
    },
    transferableSubjects: ['Computer Science', 'Mathematics', 'Logic & Physics', 'Visual Design'],
    entryPathways: [
      'University CS Degree + Summer Software Engineering Internships',
      'Open-source contributions + Production portfolio of deployed full-stack web applications',
      'Structured technical bootcamps with verified algorithmic and systems foundations',
    ],
    tradeoffsAndUncertainties: [
      'Rapid framework churn requires constant ongoing learning outside working hours',
      'Can experience tight sprint deadlines and on-call rotation responsibilities',
      'Entry-level job market has become competitive, prioritizing verified projects over degrees alone',
    ],
    practicalMiniProjects: [
      {
        title: 'Build a Full-Stack Task & Note API with React & Express',
        description: 'Create an application with user authentication, CRUD operations, and a SQLite/PostgreSQL database in a weekend.',
        duration: '4-6 hours',
        type: 'mini_project',
      },
      {
        title: 'Harvard CS50w - Web Programming with Python and JavaScript',
        description: 'Complete the free introductory lecture on client-server architecture and asynchronous JavaScript.',
        duration: '2 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Informational Interview with an Associate Software Engineer',
        description: 'Ask 3 specific questions: What does a typical Tuesday sprint look like? How do you test before deploying? What skill was most useful in your first 90 days?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National)',
          currency: 'USD',
          min: 77020,
          median: 130160,
          max: 208620,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) OEWS',
          sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 15-1252 Software Developers',
        },
        {
          geographicScope: 'India (Tier-1 Tech Hubs - Bengaluru, NCR, Pune, Hyderabad)',
          currency: 'INR',
          min: 450000,
          median: 950000,
          max: 2800000,
          period: 'per year',
          sourceName: 'NASSCOM / AmbitionBox Industry Compensation Report',
          sourceUrl: 'https://www.ambitionbox.com/salaries/full-stack-developer-salary',
          publicationYear: 2024,
          socCodeOrStandard: 'Software Engineer - Full Stack (0-4 yrs experience)',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '17% (Much faster than average for all occupations)',
        projectedOpeningsText: 'Approx. 140,100 projected job openings each year over the decade',
        sourceName: 'US Bureau of Labor Statistics Employment Projections',
        sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Junior / Associate Full-Stack Developer',
          companyOrType: 'Mid-sized SaaS Product Company (Illustrative Example)',
          location: 'Hybrid / Remote-Eligible',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard 2024 industry hiring criteria',
          sampleResponsibilities: [
            'Maintain React 18+ component libraries and TypeScript state machines',
            'Write secure Node.js REST API endpoints connecting to PostgreSQL',
            'Collaborate with QA engineers to write Jest and Cypress automated tests',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: 'Association for Computing Machinery (ACM)',
          type: 'Professional Association',
          url: 'https://www.acm.org',
          countryOrScope: 'International',
        },
        {
          name: 'IEEE Computer Society',
          type: 'Professional Association',
          url: 'https://www.computer.org',
          countryOrScope: 'International',
        },
      ],
      industryReports: [
        {
          title: 'Stack Overflow Developer Survey 2024',
          publisher: 'Stack Overflow',
          year: 2024,
          keyInsight: 'JavaScript, TypeScript, Python, and SQL remain the top 4 most used languages among professional developers worldwide.',
          citationUrl: 'https://survey.stackoverflow.co/2024/technology/',
        },
      ],
      limitationsNote: 'Salaries vary significantly based on individual negotiation, company size, equity grants, and local cost of living. Figures represent aggregate industry benchmarks.',
    },
  },

  // 2. Data Scientist & Quantitative Analyst
  {
    careerId: 'data-scientist',
    title: 'Data Scientist & Quantitative Analyst',
    domain: 'AI, Data & Mathematics',
    summary: 'Transforms large, complex datasets into actionable predictive models, statistical insights, and data-driven product decisions.',
    description: 'Data scientists combine statistical rigor, mathematical programming, and domain expertise. Daily work includes exploratory data analysis in Python/SQL, training predictive machine learning models, conducting A/B experiments, and presenting findings to executive leadership.',
    keyActivities: [
      'Extracting, cleaning, and preprocessing unstructured and relational datasets',
      'Training, validating, and evaluating machine learning algorithms (regression, clustering, trees)',
      'Designing and analyzing randomized controlled A/B experiment metrics',
      'Creating interactive data visualizations and communicating actionable insights to non-technical stakeholders',
    ],
    workStyleTags: ['Analytical & Logic', 'Deep Research', 'Working with Data'],
    environmentTags: ['Corporate / Tech Headquarters', 'Hybrid / Remote friendly'],
    priorityTags: ['High Income Potential', 'Intellectual Curiosity', 'High Job Stability'],
    educationRequirement: {
      level: "Bachelor's or Master's Degree in Quantitative Discipline",
      typicalMajors: ['Data Science', 'Statistics', 'Mathematics', 'Computer Science', 'Economics', 'Physics'],
      willingnessMatch: ['bachelors', 'masters_phd'],
    },
    transferableSubjects: ['Mathematics & Statistics', 'Computer Science', 'Economics', 'Scientific Method'],
    entryPathways: [
      'Degree in Statistics/CS + Portfolio of Kaggle competitions and end-to-end exploratory data projects',
      'Transition from Business/Data Analyst role through Python modeling mastery',
      'Specialized Master of Science in Data Science / Applied Statistics',
    ],
    tradeoffsAndUncertainties: [
      'Real-world data is frequently messy, incomplete, and requires 70%+ time on cleaning rather than modeling',
      'High competition from master’s and PhD graduates for research-heavy machine learning positions',
      'Balancing mathematical perfection with fast business deadlines can be challenging',
    ],
    practicalMiniProjects: [
      {
        title: 'Exploratory Data Analysis on Public Housing or University Datasets',
        description: 'Use Python (Pandas, Seaborn) to uncover statistical trends, correlations, and build a simple regression predictor.',
        duration: '3-5 hours',
        type: 'mini_project',
      },
      {
        title: 'Coursera / Stanford - Machine Learning Foundations (Andrew Ng)',
        description: 'Watch the introductory modules on linear regression, cost functions, and gradient descent.',
        duration: '2.5 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Informational Interview with a Senior Data Analyst or Data Scientist',
        description: 'Ask: How much of your day is SQL vs Python vs meetings? What differentiates an entry-level candidate who gets hired?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National)',
          currency: 'USD',
          min: 61070,
          median: 108020,
          max: 184090,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) OEWS',
          sourceUrl: 'https://www.bls.gov/ooh/math/data-scientists.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 15-2051 Data Scientists',
        },
        {
          geographicScope: 'India (Tier-1 Hubs)',
          currency: 'INR',
          min: 500000,
          median: 1100000,
          max: 3200000,
          period: 'per year',
          sourceName: 'Analytics India Magazine Annual Salary Study',
          sourceUrl: 'https://analyticsindiamag.com',
          publicationYear: 2024,
          socCodeOrStandard: 'Data Scientist (0-5 yrs experience)',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '36% (Much faster than average for all occupations)',
        projectedOpeningsText: 'Approx. 20,800 projected job openings annually',
        sourceName: 'US Bureau of Labor Statistics Employment Projections',
        sourceUrl: 'https://www.bls.gov/ooh/math/data-scientists.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Associate Data Scientist - Analytics & Growth',
          companyOrType: 'FinTech / E-commerce Platform (Illustrative Example)',
          location: 'Hybrid / Major Metro',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard quantitative analyst hiring criteria',
          sampleResponsibilities: [
            'Write complex SQL queries across BigQuery / Snowflake data lakes',
            'Develop churn prediction and user segment models using scikit-learn',
            'Communicate metric experiment conclusions to product managers weekly',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: 'American Statistical Association (ASA)',
          type: 'Professional Association',
          url: 'https://www.amstat.org',
          countryOrScope: 'International',
        },
        {
          name: 'INFORMS (The Institute for Operations Research and the Management Sciences)',
          type: 'Professional Association',
          url: 'https://www.informs.org',
          countryOrScope: 'International',
        },
      ],
      industryReports: [
        {
          title: 'World Economic Forum Future of Jobs Report 2023-2027',
          publisher: 'World Economic Forum (WEF)',
          year: 2023,
          keyInsight: 'Data Analysts, Data Scientists, and Big Data Specialists rank #1 in projected job growth worldwide through 2027.',
          citationUrl: 'https://www.weforum.org/publications/the-future-of-jobs-report-2023/',
        },
      ],
      limitationsNote: 'Data Scientist titles vary widely across companies: some roles focus on SQL business intelligence reporting, while others require advanced machine learning research.',
    },
  },

  // 3. Cybersecurity Analyst & Information Security Engineer
  {
    careerId: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst & Defense Specialist',
    domain: 'Cybersecurity & Infrastructure',
    summary: 'Protects critical computer networks, sensitive organizational data, and digital assets from unauthorized access and malicious cyber threats.',
    description: 'Cybersecurity analysts monitor enterprise networks for security breaches, configure firewalls and intrusion detection systems, investigate security alerts, and ensure compliance with regulatory standards.',
    keyActivities: [
      'Monitoring network traffic and Security Operations Center (SOC) telemetry for anomalies',
      'Conducting vulnerability assessments, penetration tests, and threat intelligence analysis',
      'Configuring identity access management (IAM), multi-factor authentication, and firewalls',
      'Formulating incident response plans and leading post-incident security forensics',
    ],
    workStyleTags: ['Analytical & Logic', 'Organizing & Structure', 'Deep Research'],
    environmentTags: ['Corporate Security Operations Center (SOC)', 'Government / Defense', 'Hybrid friendly'],
    priorityTags: ['High Job Stability', 'High Income Potential', 'Public Safety & Impact'],
    educationRequirement: {
      level: "Bachelor's Degree or Industry Certification Track",
      typicalMajors: ['Cybersecurity', 'Computer Science', 'Information Systems', 'Criminal Justice / Forensics'],
      willingnessMatch: ['bachelors', 'certifications_self_taught'],
    },
    transferableSubjects: ['Computer Networking', 'Computer Science', 'Logic & Law', 'Criminal Forensics'],
    entryPathways: [
      'IT Support / Network Technician foundation $\\rightarrow$ CompTIA Security+ / CySA+ certification',
      'Cybersecurity Bachelor’s Degree with collegiate defense competitions (CCDC / CTFs)',
      'Security Operations Center (SOC) Level 1 triage analyst internship',
    ],
    tradeoffsAndUncertainties: [
      'High-stress environments when incident response requires immediate mitigation during active breaches',
      'Rigorous background checks and security clearances frequently required for government/defense roles',
      'Adversarial field requiring continuous knowledge of emerging zero-day vulnerabilities and attacker techniques',
    ],
    practicalMiniProjects: [
      {
        title: 'OverTheWire Bandit - Complete First 10 Linux & Security Levels',
        description: 'Practice foundational Linux commands, file permissions, and secure shell (SSH) navigation on a live practice server.',
        duration: '2-4 hours',
        type: 'mini_project',
      },
      {
        title: 'Coursera / Google Cybersecurity Professional Certificate Module 1',
        description: 'Learn the CIA Triad (Confidentiality, Integrity, Availability) and the 8 CIS critical security controls.',
        duration: '2 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Informational Interview with a SOC Analyst or Security Engineer',
        description: 'Ask: What alert types do you see most often? What certification actually helped you get interviewed? How do you avoid burnout?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National)',
          currency: 'USD',
          min: 69430,
          median: 120360,
          max: 182370,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) OEWS',
          sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 15-1212 Information Security Analysts',
        },
        {
          geographicScope: 'United Kingdom (National)',
          currency: 'GBP',
          min: 32000,
          median: 55000,
          max: 95000,
          period: 'per year',
          sourceName: 'UK National Careers Service / IT Jobs Watch',
          sourceUrl: 'https://nationalcareers.service.gov.uk/job-profiles/cyber-security-analyst',
          publicationYear: 2024,
          socCodeOrStandard: 'Cyber Security Analyst UK National Benchmark',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '33% (Much faster than average for all occupations)',
        projectedOpeningsText: 'Approx. 16,800 projected job openings annually',
        sourceName: 'US Bureau of Labor Statistics Employment Projections',
        sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Junior SOC Analyst (Tier 1)',
          companyOrType: 'Managed Security Service Provider / Enterprise (Illustrative Example)',
          location: 'In-Office / Hybrid SOC',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard entry-level SOC requirements',
          sampleResponsibilities: [
            'Triage and investigate automated SIEM alerts (Splunk / Microsoft Sentinel)',
            'Document incident tickets and escalate critical indicators of compromise (IOCs)',
            'Assist in endpoint compliance audits and phishing awareness simulations',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: '(ISC)² - International Information System Security Certification Consortium',
          type: 'Certification Body',
          url: 'https://www.isc2.org',
          countryOrScope: 'International',
        },
        {
          name: 'ISACA (Information Systems Audit and Control Association)',
          type: 'Professional Association',
          url: 'https://www.isaca.org',
          countryOrScope: 'International',
        },
        {
          name: 'CompTIA (Computing Technology Industry Association)',
          type: 'Certification Body',
          url: 'https://www.comptia.org',
          countryOrScope: 'International',
        },
      ],
      industryReports: [
        {
          title: 'ISC2 Cybersecurity Workforce Study 2023/2024',
          publisher: 'ISC2',
          year: 2023,
          keyInsight: 'The global cybersecurity workforce gap is estimated at 4 million unfilled professionals, with 92% of organizations reporting security skills shortages.',
          citationUrl: 'https://www.isc2.org/Research/Workforce-Study',
        },
      ],
      limitationsNote: 'Security clearances and night/weekend on-call rotations are frequent in Tier 1 operations center positions.',
    },
  },

  // 4. Product Designer & UX Researcher
  {
    careerId: 'ux-product-designer',
    title: 'Product Designer & UX Researcher',
    domain: 'Design & Creative Media',
    summary: 'Crafts intuitive, accessible, and delightful digital user experiences by combining user research, interaction design, and visual prototyping.',
    description: 'Product designers work at the intersection of human psychology, visual aesthetics, and business strategy. Daily work includes conducting user interviews, mapping user flows, wireframing in Figma, testing design prototypes with real users, and ensuring design system consistency with frontend developers.',
    keyActivities: [
      'Conducting qualitative user interviews and usability testing sessions',
      'Designing wireframes, interactive component prototypes, and high-fidelity mockups in Figma',
      'Maintaining scalable design systems with reusable typography, tokens, and accessible contrast',
      'Partnering closely with product managers and engineers to ship user-centered feature releases',
    ],
    workStyleTags: ['Creating things', 'Working with people', 'Analytical & Logic'],
    environmentTags: ['Design Studio / Tech Office', 'Remote / Hybrid friendly'],
    priorityTags: ['Creative Autonomy', 'Flexibility & Remote', 'Work-Life Balance'],
    educationRequirement: {
      level: "Bachelor's Degree or Case-Study Design Portfolio",
      typicalMajors: ['Human-Computer Interaction (HCI)', 'Graphic Design', 'Psychology', 'Cognitive Science', 'Communications'],
      willingnessMatch: ['bachelors', 'certifications_self_taught'],
    },
    transferableSubjects: ['Psychology & Sociology', 'Art & Visual Design', 'Computer Science', 'Writing'],
    entryPathways: [
      'HCI / Digital Design degree with verified Figma case-study portfolio solving real user problems',
      'Transition from graphic design or frontend development by mastering user research methodologies',
      'Junior UX Designer / Product Design apprentice at design agencies or startups',
    ],
    tradeoffsAndUncertainties: [
      'Portfolio quality matters significantly more than degrees: candidates must prove user-centered problem solving, not just pretty visuals',
      'Must advocate for user needs while navigating strict business revenue and timeline constraints',
      'Subjective feedback from diverse executive stakeholders can require multiple iterative revisions',
    ],
    practicalMiniProjects: [
      {
        title: 'Redesign a Frustrating University App Flow in Figma',
        description: 'Identify 1 confusing workflow (e.g. course registration), interview 2 students, and create a 4-screen interactive wireframe prototype.',
        duration: '4 hours',
        type: 'mini_project',
      },
      {
        title: 'Laws of UX (Jon Yablonski) - Study 5 Core UX Principles',
        description: 'Study Hick\'s Law, Fitts\'s Law, and Jakob\'s Law, and find real-world examples of each in your favorite mobile app.',
        duration: '1.5 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Informational Interview with a Product Designer',
        description: 'Ask: How do you know when a design is ready to hand off? How do you test with users when budget is tight?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National)',
          currency: 'USD',
          min: 52180,
          median: 89000,
          max: 154000,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) Special Visual/Digital Design Category',
          sourceUrl: 'https://www.bls.gov/ooh/arts-and-design/special-effects-artists-and-animators.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 27-1014 / Digital Interface Designers',
        },
        {
          geographicScope: 'Global Tech Benchmark (Designers at Venture-Backed Startups)',
          currency: 'USD',
          min: 65000,
          median: 105000,
          max: 175000,
          period: 'per year',
          sourceName: 'Design Systems & Product Design Compensation Benchmark',
          sourceUrl: 'https://www.levels.fyi',
          publicationYear: 2024,
          socCodeOrStandard: 'Product Designer (Levels.fyi Benchmark)',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '8% (Faster than average for digital interface design)',
        projectedOpeningsText: 'Approx. 9,400 projected job openings annually',
        sourceName: 'US Bureau of Labor Statistics Digital Designers',
        sourceUrl: 'https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Associate Product Designer (UI/UX)',
          companyOrType: 'HealthTech / EdTech Mobile App (Illustrative Example)',
          location: 'Remote / Hybrid',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard junior product design portfolio requirements',
          sampleResponsibilities: [
            'Create interactive mobile wireframes, flows, and specs in Figma',
            'Conduct remote user testing sessions and document behavioral insights',
            'Collaborate with developers in design QA review prior to release',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: 'Interaction Design Association (IxDA)',
          type: 'Professional Association',
          url: 'https://ixda.org',
          countryOrScope: 'International',
        },
        {
          name: 'Nielsen Norman Group (NN/g)',
          type: 'Industry Research & Certification',
          url: 'https://www.nngroup.com',
          countryOrScope: 'International',
        },
      ],
      industryReports: [
        {
          title: 'Design In Tech Report',
          publisher: 'John Maeda / Automattic Design Research',
          year: 2023,
          keyInsight: 'Organizations with mature design systems and user research practices report 2x faster product deployment and higher customer retention.',
          citationUrl: 'https://designintech.report',
        },
      ],
      limitationsNote: 'Compensation in design correlates directly with portfolio depth and demonstrating commercial impact rather than formal certifications.',
    },
  },

  // 5. Clinical Psychologist & Mental Health Counselor
  {
    careerId: 'clinical-psychologist',
    title: 'Clinical Psychologist & Behavioral Specialist',
    domain: 'Healthcare & Life Sciences',
    summary: 'Assesses, diagnoses, and supports individuals experiencing mental health challenges, emotional distress, and behavioral disorders.',
    description: 'Clinical psychologists combine scientific behavioral research with deep empathetic care. Daily work includes conducting diagnostic clinical interviews, providing evidence-based psychotherapy (e.g. CBT, ACT), administering psychological assessments, and collaborating with multidisciplinary medical teams.',
    keyActivities: [
      'Conducting comprehensive clinical diagnostic interviews and psychological assessments',
      'Delivering structured psychotherapy sessions for individuals, families, or groups',
      'Developing personalized behavioral treatment plans and monitoring patient wellness',
      'Maintaining confidential clinical case notes and adhering to ethical regulatory guidelines',
    ],
    workStyleTags: ['Working with people', 'Deep Research', 'Analytical & Logic'],
    environmentTags: ['Hospital / Medical Clinic', 'Private Practice Office', 'University / School'],
    priorityTags: ['Social Impact & Helping Others', 'High Job Stability', 'Work-Life Balance'],
    educationRequirement: {
      level: "Master's or Doctoral Degree (PsyD / PhD / MSW) + State/National Licensure",
      typicalMajors: ['Psychology', 'Neuroscience', 'Social Work', 'Human Development', 'Biology'],
      willingnessMatch: ['masters_phd'],
    },
    transferableSubjects: ['Psychology & Human Behavior', 'Biology & Neuroscience', 'Statistics & Research Methods', 'Ethics & Philosophy'],
    entryPathways: [
      'Undergraduate Psychology degree $\\rightarrow$ Supervised Clinical Research Assistant $\\rightarrow$ Accredited Doctoral / Master’s program $\\rightarrow$ Supervised internship hours & licensing exam',
      'Master of Social Work (MSW) or Clinical Mental Health Counseling (LMHC/LPC) pathway',
    ],
    tradeoffsAndUncertainties: [
      'Substantial educational and supervised clinical training commitment (5–7 years post-undergraduate for full doctoral licensure)',
      'High emotional demands require rigorous personal boundaries and proactive self-care to avoid compassion fatigue',
      'Licensing regulations are strictly geographic and can be complex when moving between states or countries',
    ],
    practicalMiniProjects: [
      {
        title: 'Review a Peer-Reviewed Clinical Psychology Case Study',
        description: 'Read an open-access clinical psychology case review from the APA, summarizing the client presentation, theoretical framework, and outcome.',
        duration: '2 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Complete Crisis Support or Peer Mentorship Volunteer Orientation',
        description: 'Explore active volunteer roles at local youth helplines, campus counseling peer groups, or active listener platforms.',
        duration: '3 hours',
        type: 'mini_project',
      },
      {
        title: 'Informational Interview with a Licensed Counselor or Psychologist',
        description: 'Ask: How did you choose between a PhD, PsyD, or Master’s in Counseling? How do you manage emotional boundaries with clients?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National)',
          currency: 'USD',
          min: 49400,
          median: 96100,
          max: 151880,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) OEWS',
          sourceUrl: 'https://www.bls.gov/ooh/life-physical-and-social-science/psychologists.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 19-3031 Clinical, Counseling, and School Psychologists',
        },
        {
          geographicScope: 'United Kingdom (NHS Agenda for Change Bands 7-8)',
          currency: 'GBP',
          min: 43742,
          median: 50952,
          max: 70000,
          period: 'per year',
          sourceName: 'UK National Health Service (NHS) Agenda for Change Pay Scales',
          sourceUrl: 'https://www.healthcareers.nhs.uk/explore-roles/psychological-professions/roles-psychological-professions/clinical-psychologist',
          publicationYear: 2024,
          socCodeOrStandard: 'Clinical Psychologist NHS Band 7/8a',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '7% (Faster than average for all occupations)',
        projectedOpeningsText: 'Approx. 13,300 projected job openings annually across clinics, schools, and private practice',
        sourceName: 'US Bureau of Labor Statistics Employment Projections',
        sourceUrl: 'https://www.bls.gov/ooh/life-physical-and-social-science/psychologists.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Staff Clinical Psychologist / Licensed Professional Counselor',
          companyOrType: 'Outpatient Behavioral Health Center (Illustrative Example)',
          location: 'Clinic / Telehealth Hybrid',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard healthcare facility staffing requirements',
          sampleResponsibilities: [
            'Conduct intake evaluations and diagnose cognitive and emotional concerns',
            'Provide weekly evidence-based individual therapy sessions (CBT / Psychodynamic)',
            'Coordinate care plans with psychiatrists and primary care physicians',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: 'American Psychological Association (APA)',
          type: 'Professional Association & Accreditation',
          url: 'https://www.apa.org',
          countryOrScope: 'United States / International',
        },
        {
          name: 'British Psychological Society (BPS)',
          type: 'Professional Association & Royal Charter',
          url: 'https://www.bps.org.uk',
          countryOrScope: 'United Kingdom',
        },
      ],
      industryReports: [
        {
          title: 'WHO Mental Health Report: Transforming Mental Health for All',
          publisher: 'World Health Organization (WHO)',
          year: 2022,
          keyInsight: 'Global demand for accredited behavioral health practitioners has risen over 25% post-pandemic, creating sustained long-term public health need.',
          citationUrl: 'https://www.who.int/publications/i/item/9789240049338',
        },
      ],
      limitationsNote: 'Unsupervised practice strictly mandates professional licensure from state/national regulatory medical boards.',
    },
  },

  // 6. Financial Analyst & Corporate Strategy Associate
  {
    careerId: 'financial-analyst',
    title: 'Financial Analyst & Investment Associate',
    domain: 'Business, Finance & Consulting',
    summary: 'Analyzes financial performance, market conditions, and valuation models to guide capital allocation, investment decisions, and corporate strategy.',
    description: 'Financial analysts evaluate balance sheets, economic trends, and operational metrics. Daily work includes building dynamic discounted cash flow (DCF) models in Excel, forecasting quarterly revenue, creating investor presentations, and conducting competitor benchmarking.',
    keyActivities: [
      'Building three-statement financial models and forecasting operational cash flow',
      'Analyzing macroeconomic indicators, industry competitors, and quarterly earnings filings',
      'Synthesizing investment memos and pitch decks for leadership or institutional investors',
      'Monitoring budget variance and recommending operational cost efficiencies',
    ],
    workStyleTags: ['Analytical & Logic', 'Organizing & Structure', 'Working with Data'],
    environmentTags: ['Corporate Headquarters', 'Investment Bank / Asset Management', 'Hybrid friendly'],
    priorityTags: ['High Income Potential', 'High Job Stability', 'Fast-Paced Entrepreneurship'],
    educationRequirement: {
      level: "Bachelor's Degree in Business, Finance, Economics, or Quantitative Field",
      typicalMajors: ['Finance', 'Economics', 'Accounting', 'Business Administration', 'Mathematics'],
      willingnessMatch: ['bachelors', 'masters_phd'],
    },
    transferableSubjects: ['Economics & Finance', 'Mathematics & Accounting', 'Business Strategy', 'Writing & Communications'],
    entryPathways: [
      'Undergraduate Finance/Economics degree + Summer analyst internship at investment bank, consulting firm, or corporate finance department',
      'Pursuing CFA (Chartered Financial Analyst) Level 1 exam during or shortly after graduation',
      'Transition from Accounting or Business Operations through Excel financial modeling proficiency',
    ],
    tradeoffsAndUncertainties: [
      'High-workload periods during quarterly earnings and financial year-end closures',
      'Work culture can be demanding in investment banking and transaction advisory',
      'Repetitive spreadsheet modeling and compliance auditing during initial entry-level stages',
    ],
    practicalMiniProjects: [
      {
        title: 'Build a 3-Year Income Statement Forecast in Excel or Google Sheets',
        description: 'Download the public 10-K filing of a company you admire (e.g. Apple or Spotify) and project next year\'s revenue using historical growth rates.',
        duration: '3 hours',
        type: 'mini_project',
      },
      {
        title: 'CFI (Corporate Finance Institute) Free Financial Modeling Fundamentals',
        description: 'Complete the introductory module on income statements, balance sheets, and working capital.',
        duration: '2 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Informational Interview with a Corporate Financial Analyst',
        description: 'Ask: What Excel shortcuts or financial concepts do you use every day? How do you handle high-pressure deadlines during earnings season?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National)',
          currency: 'USD',
          min: 57900,
          median: 99890,
          max: 175900,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) OEWS',
          sourceUrl: 'https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 13-2051 Financial and Investment Analysts',
        },
        {
          geographicScope: 'India (Financial Hub - Mumbai, Bengaluru, Gurugram)',
          currency: 'INR',
          min: 400000,
          median: 850000,
          max: 2200000,
          period: 'per year',
          sourceName: 'KPMG / Michael Page India Banking & Financial Services Salary Guide',
          sourceUrl: 'https://www.michaelpage.co.in/salary-guide',
          publicationYear: 2024,
          socCodeOrStandard: 'Financial Analyst / Senior Financial Analyst (0-4 yrs)',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '9% (Faster than average for business occupations)',
        projectedOpeningsText: 'Approx. 29,000 projected openings each year over the decade',
        sourceName: 'US Bureau of Labor Statistics Employment Projections',
        sourceUrl: 'https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Junior Financial Analyst - Corporate FP&A',
          companyOrType: 'Multinational Consumer Goods / Enterprise (Illustrative Example)',
          location: 'Metropolitan Financial Hub / Hybrid',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard corporate finance entry criteria',
          sampleResponsibilities: [
            'Assist in consolidating monthly profit and loss statements across regional units',
            'Develop revenue forecasting models using Excel and PowerBI/Tableau',
            'Prepare monthly executive financial review summaries for senior directors',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: 'CFA Institute (Chartered Financial Analyst)',
          type: 'Global Certification Body',
          url: 'https://www.cfainstitute.org',
          countryOrScope: 'International',
        },
        {
          name: 'Financial Modeling & Valuation Analyst (FMVA) / CFI',
          type: 'Professional Certification',
          url: 'https://corporatefinanceinstitute.com',
          countryOrScope: 'International',
        },
      ],
      industryReports: [
        {
          title: 'Future of Finance Report',
          publisher: 'CFA Institute',
          year: 2023,
          keyInsight: 'Financial analysts with dual competency in financial modeling and Python/SQL automated data processing command 18% higher placement rates.',
          citationUrl: 'https://www.cfainstitute.org/en/research/future-finance',
        },
      ],
      limitationsNote: 'Significant compensation divergence exists between buy-side investment banking/private equity and corporate FP&A roles.',
    },
  },

  // 7. Technology Policy Analyst & Compliance Specialist
  {
    careerId: 'tech-policy-analyst',
    title: 'Technology Policy Analyst & Compliance Specialist',
    domain: 'Law, Policy & Public Service',
    summary: 'Analyzes digital governance, artificial intelligence ethics, cybersecurity privacy laws, and regulatory compliance frameworks.',
    description: 'Technology policy analysts bridge legislative intent, legal ethics, and technical systems. Daily work includes researching privacy legislation (e.g. GDPR, AI Act, CCPA), writing policy briefs, assessing ethical AI safety, and helping organizations comply with international digital standards.',
    keyActivities: [
      'Analyzing international technology legislation, antitrust rules, and data privacy frameworks',
      'Authoring clear, non-technical policy whitepapers for lawmakers or corporate boards',
      'Conducting ethical AI impact assessments and data governance audits',
      'Facilitating stakeholder working groups between engineers, civil society, and legal teams',
    ],
    workStyleTags: ['Deep Research', 'Writing & Analysis', 'Working with people'],
    environmentTags: ['Think Tank / Non-Profit', 'Government Agency', 'Corporate Legal / Public Policy'],
    priorityTags: ['Social Impact & Helping Others', 'High Job Stability', 'Intellectual Curiosity'],
    educationRequirement: {
      level: "Bachelor's or Master's Degree (Public Policy, Law, Political Science, or Tech Ethics)",
      typicalMajors: ['Public Policy', 'Political Science', 'Law', 'Philosophy, Politics & Economics (PPE)', 'Computer Science'],
      willingnessMatch: ['bachelors', 'masters_phd'],
    },
    transferableSubjects: ['Law & Political Science', 'Philosophy & Ethics', 'Writing & Communications', 'Computer Science'],
    entryPathways: [
      'Degree in Political Science / Law / CS + Policy research internship at think tanks or advocacy institutes',
      'Graduate degree in Public Policy (MPP) or Law (JD / LLM) specializing in cyber/tech governance',
      'Junior compliance analyst within regulated FinTech or Healthcare enterprises',
    ],
    tradeoffsAndUncertainties: [
      'Regulatory policy moves slower than rapid technical innovation, which can feel frustrating for practitioners',
      'Funding and hiring can depend on political administrations, government budgets, and grants',
      'Requires reading extensive, highly complex legal texts and regulatory statutes daily',
    ],
    practicalMiniProjects: [
      {
        title: 'Draft a 2-Page Executive Brief on the European Union AI Act',
        description: 'Summarize the risk classification tiers (Unacceptable, High, Minimal Risk) and what it means for student developers building AI apps.',
        duration: '3 hours',
        type: 'mini_project',
      },
      {
        title: 'Electronic Frontier Foundation (EFF) / Berkman Klein Tech Policy Primer',
        description: 'Read the foundational case study on digital privacy, algorithmic bias, and encryption rights.',
        duration: '1.5 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Informational Interview with a Tech Policy Fellow or Compliance Officer',
        description: 'Ask: How did you transition from your degree into tech policy? How technical does someone need to be to be effective?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National - Washington DC / Metro Hubs)',
          currency: 'USD',
          min: 58800,
          median: 91400,
          max: 147500,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) Policy & Compliance Analysts',
          sourceUrl: 'https://www.bls.gov/ooh/life-physical-and-social-science/political-scientists.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 19-3094 Political Scientists & Policy Analysts',
        },
        {
          geographicScope: 'European Union (Brussels / Tech Regulatory Hubs)',
          currency: 'EUR',
          min: 42000,
          median: 68000,
          max: 110000,
          period: 'per year',
          sourceName: 'EU Public Affairs & Policy Salary Survey',
          sourceUrl: 'https://www.politico.eu',
          publicationYear: 2024,
          socCodeOrStandard: 'Technology Policy Officer (EU Benchmark)',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '6% (Average growth for specialized policy analysts)',
        projectedOpeningsText: 'Steadily increasing demand specifically within AI governance, privacy compliance, and antitrust regulation',
        sourceName: 'US Bureau of Labor Statistics Employment Projections',
        sourceUrl: 'https://www.bls.gov/ooh/life-physical-and-social-science/political-scientists.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Associate Policy Analyst - Digital Governance & AI',
          companyOrType: 'Independent Technology Policy Think Tank (Illustrative Example)',
          location: 'Washington DC / Hybrid / Remote-Eligible',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard public policy research associate criteria',
          sampleResponsibilities: [
            'Research emerging artificial intelligence regulatory frameworks and legislative filings',
            'Conduct comparative analysis between US federal standards, state laws, and international treaties',
            'Co-author research memoranda and participate in public consultations',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: 'IAPP (International Association of Privacy Professionals)',
          type: 'Certification Body (CIPP/E, CIPP/US)',
          url: 'https://iapp.org',
          countryOrScope: 'International',
        },
        {
          name: 'IEEE Global Initiative on Ethics of Autonomous and Intelligent Systems',
          type: 'Standard Setting Body',
          url: 'https://ethicsinaction.ieee.org',
          countryOrScope: 'International',
        },
      ],
      industryReports: [
        {
          title: 'Stanford University AI Index Report 2024 - Policy & Governance Chapter',
          publisher: 'Stanford Institute for Human-Centered Artificial Intelligence (HAI)',
          year: 2024,
          keyInsight: 'AI-related regulations passed globally increased by over 200% between 2020 and 2024, driving unprecedented demand for technical policy literacy.',
          citationUrl: 'https://aiindex.stanford.edu/report/',
        },
      ],
      limitationsNote: 'Public interest and non-profit advocacy roles generally offer lower compensation bands compared to corporate government affairs in multinational technology firms.',
    },
  },

  // 8. Robotics & Embedded Systems Engineer
  {
    careerId: 'robotics-embedded-engineer',
    title: 'Robotics & Embedded Systems Engineer',
    domain: 'Engineering & Hardware',
    summary: 'Designs, programs, and integrates real-time microcontrollers, sensors, actuators, and physical robotic control systems.',
    description: 'Embedded systems engineers bring code to life in physical hardware. Daily work includes writing low-level C and C++ for microcontrollers, configuring sensor communication buses (I2C, SPI, CAN), debugging circuit schematics with oscilloscopes, and implementing real-time control algorithms (PID, Kalman filters).',
    keyActivities: [
      'Writing firmware in modern C and C++ for ARM Cortex microcontrollers and real-time operating systems (RTOS)',
      'Designing motor control, sensor telemetry, and hardware communication drivers',
      'Prototyping physical electronics on breadboards, testing with logic analyzers and oscilloscopes',
      'Implementing safety-critical feedback loops for autonomous mobility and robotic manipulators',
    ],
    workStyleTags: ['Hands-on Execution', 'Analytical & Logic', 'Creating things'],
    environmentTags: ['Hardware Laboratory', 'Manufacturing / Robotics Facility', 'In-Person & Hybrid'],
    priorityTags: ['Hands-on Tangible Creation', 'High Job Stability', 'Intellectual Curiosity'],
    educationRequirement: {
      level: "Bachelor's Degree in Electrical, Computer, or Mechanical Engineering",
      typicalMajors: ['Electrical Engineering', 'Computer Engineering', 'Robotics', 'Mechanical Engineering', 'Mechatronics'],
      willingnessMatch: ['bachelors', 'masters_phd'],
    },
    transferableSubjects: ['Physics & Electronics', 'Mathematics & Calculus', 'Computer Science (C/C++)', 'Mechanical Dynamics'],
    entryPathways: [
      'Undergraduate Engineering degree with robotics club or Formula Student / solar car team experience',
      'Building tangible Arduino/STM32 hardware projects with custom printed circuit boards (PCBs)',
      'Hardware firmware co-op or internship at medical device, automotive, or industrial robotics firms',
    ],
    tradeoffsAndUncertainties: [
      'Hardware bugs cannot be solved with a simple cloud software patch: physical prototypes take time to fabricate',
      'Requires substantial in-person laboratory time with physical hardware benches and measurement tools',
      'Debugging requires understanding both digital software and physical analog electronic noise',
    ],
    practicalMiniProjects: [
      {
        title: 'Program an STM32 or ESP32 Real-Time Sensor Telemetry Loop',
        description: 'Read data from an I2C accelerometer sensor in C and stream output over serial UART with non-blocking timing.',
        duration: '4 hours',
        type: 'mini_project',
      },
      {
        title: 'Ben Eater - How Computers Work and 8-bit Computer Architecture',
        description: 'Watch the introductory modules on clock signals, registers, and memory bus architecture.',
        duration: '2 hours',
        type: 'intro_lesson',
      },
      {
        title: 'Informational Interview with an Embedded Firmware or Robotics Engineer',
        description: 'Ask: How much of your week is writing C code vs testing boards with multimeters? What advice would you give an engineering student?',
        duration: '30 mins',
        type: 'informational_interview',
      },
    ],
    evidence: {
      salaryData: [
        {
          geographicScope: 'United States (National)',
          currency: 'USD',
          min: 78500,
          median: 119860,
          max: 181500,
          period: 'per year',
          sourceName: 'US Bureau of Labor Statistics (BLS) OEWS',
          sourceUrl: 'https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm',
          publicationYear: 2024,
          socCodeOrStandard: 'SOC 17-2071 Electrical & Computer Hardware Engineers',
        },
        {
          geographicScope: 'Germany & Western Europe (Robotics & Automotive Core)',
          currency: 'EUR',
          min: 52000,
          median: 74000,
          max: 105000,
          period: 'per year',
          sourceName: 'VDI (Association of German Engineers) Salary Survey',
          sourceUrl: 'https://www.vdi.de',
          publicationYear: 2024,
          socCodeOrStandard: 'Embedded Systems & Robotics Engineer (0-4 yrs experience)',
        },
      ],
      employmentOutlook: {
        geographicScope: 'United States (2023 - 2033 projection)',
        growthRateText: '9% (Faster than average for engineering occupations)',
        projectedOpeningsText: 'Approx. 18,900 projected job openings annually driven by automation and electric vehicle systems',
        sourceName: 'US Bureau of Labor Statistics Employment Projections',
        sourceUrl: 'https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm',
        publicationYear: 2024,
      },
      sampleRolesOrJobPostings: [
        {
          title: 'Associate Embedded Software Engineer',
          companyOrType: 'Autonomous Systems / Industrial Automation Manufacturer (Illustrative Example)',
          location: 'On-site Laboratory / Hybrid',
          isIllustrativeDemo: true,
          sourceNote: 'Illustrative composite role reflecting standard junior firmware engineering requirements',
          sampleResponsibilities: [
            'Develop bare-metal and FreeRTOS firmware in C++ for motor controller boards',
            'Write board support package (BSP) device drivers for SPI and CAN bus sensors',
            'Debug hardware faults on prototypes alongside electrical circuit designers',
          ],
        },
      ],
      officialBodiesAndCertifications: [
        {
          name: 'IEEE Robotics and Automation Society (RAS)',
          type: 'Professional Society',
          url: 'https://www.ieee-ras.org',
          countryOrScope: 'International',
        },
        {
          name: 'Embedded Software Association / FreeRTOS Community',
          type: 'Technical Community',
          url: 'https://www.freertos.org',
          countryOrScope: 'International',
        },
      ],
      industryReports: [
        {
          title: 'World Robotics Report 2024',
          publisher: 'International Federation of Robotics (IFR)',
          year: 2024,
          keyInsight: 'Industrial and service robot installations reached an all-time record of over 540,000 units globally in 2023, expanding firmware engineering demand.',
          citationUrl: 'https://ifr.org/worldrobotics/',
        },
      ],
      limitationsNote: 'Hands-on laboratory access and physical hardware access are usually required; pure remote work is rare in early-career hardware roles.',
    },
  },
];

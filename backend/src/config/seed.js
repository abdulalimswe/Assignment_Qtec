require('dotenv').config();
const { pool } = require('./db');


const jobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'Stripe',
    location: 'Remote',
    category: 'Technology',
    description: `We are looking for a Senior Frontend Developer to join our growing engineering team at Stripe.

Responsibilities:
- Build and maintain high-performance React applications used by millions of users worldwide
- Collaborate closely with designers, product managers, and backend engineers
- Lead code reviews and mentor junior developers
- Drive frontend architecture decisions and best practices

Requirements:
- 5+ years of experience with React and TypeScript
- Deep understanding of web performance optimization
- Experience with testing frameworks (Jest, Cypress)
- Strong eye for detail and commitment to quality

Benefits:
- Competitive salary and equity package
- Fully remote with flexible working hours
- $3,000 annual learning & development budget
- Health, dental, and vision insurance`,
  },
  {
    title: 'Backend Engineer (Node.js)',
    company: 'Shopify',
    location: 'Toronto, Canada',
    category: 'Technology',
    description: `Shopify is hiring a Backend Engineer to work on our core commerce infrastructure.

Responsibilities:
- Design and implement scalable REST and GraphQL APIs
- Build microservices that handle millions of transactions per day
- Optimize database queries and improve system reliability
- Participate in on-call rotations and incident response

Requirements:
- 3+ years of Node.js and PostgreSQL experience
- Familiarity with distributed systems and event-driven architecture
- Experience with Docker and Kubernetes
- Strong communication skills

Benefits:
- Stock options and profit-sharing
- Flexible hybrid work policy
- Parental leave and family benefits
- Annual wellness allowance`,
  },
  {
    title: 'Product Designer (UI/UX)',
    company: 'Figma',
    location: 'San Francisco, USA',
    category: 'Design',
    description: `Figma is looking for a talented Product Designer to shape the future of collaborative design tools.

Responsibilities:
- Own end-to-end design for key product areas from research to launch
- Conduct user interviews, usability tests, and synthesize insights
- Create wireframes, prototypes, and high-fidelity mockups in Figma
- Work closely with engineers to ensure pixel-perfect implementation

Requirements:
- 4+ years of product design experience
- Strong portfolio showcasing complex problem-solving
- Expertise in interaction design and design systems
- Excellent communication and storytelling skills

Benefits:
- Generous equity package
- Creative and collaborative work environment
- Top-of-the-line hardware and tools
- Unlimited PTO policy`,
  },
  {
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Angeles, USA',
    category: 'Technology',
    description: `Netflix is seeking a Data Scientist to join our Personalization & Recommendations team.

Responsibilities:
- Develop ML models to improve content recommendations for 230M+ subscribers
- Design and analyze A/B experiments at massive scale
- Work with petabyte-scale datasets using Spark and Python
- Communicate findings to senior leadership and cross-functional teams

Requirements:
- MS or PhD in Statistics, Computer Science, or related field
- 3+ years experience in a data scientist role
- Proficiency in Python, SQL, and machine learning frameworks (PyTorch/TensorFlow)
- Experience with A/B testing and causal inference

Benefits:
- Industry-leading salary and stock options
- Freedom and responsibility culture
- Unlimited vacation policy
- Comprehensive health benefits`,
  },
  {
    title: 'Digital Marketing Manager',
    company: 'HubSpot',
    location: 'Dublin, Ireland',
    category: 'Marketing',
    description: `HubSpot is looking for a Digital Marketing Manager to drive our EMEA growth strategy.

Responsibilities:
- Plan and execute multi-channel digital marketing campaigns (SEO, SEM, social, email)
- Manage a €500K monthly paid media budget
- Analyse campaign performance and report on key KPIs
- Collaborate with sales to develop ABM strategies

Requirements:
- 4+ years of digital marketing experience, preferably in SaaS
- Proficiency with HubSpot, Google Analytics, and paid media platforms
- Data-driven mindset with strong analytical skills
- Experience managing and growing a team

Benefits:
- Hybrid work (3 days office / 2 days remote)
- Excellent pension and healthcare package
- €2,000 annual education budget
- Regular team events and company retreats`,
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloudflare',
    location: 'Remote',
    category: 'Technology',
    description: `Cloudflare is hiring a DevOps Engineer to help scale infrastructure serving millions of requests per second.

Responsibilities:
- Design and maintain CI/CD pipelines across multiple cloud providers
- Manage Kubernetes clusters and containerized workloads
- Implement monitoring, alerting, and incident response processes
- Automate infrastructure provisioning using Terraform

Requirements:
- 3+ years of DevOps or SRE experience
- Strong experience with AWS/GCP, Kubernetes, and Terraform
- Proficiency in scripting (Bash, Python)
- Experience with observability tools (Prometheus, Grafana, Datadog)

Benefits:
- Fully remote with home office stipend
- Competitive salary + RSUs
- 401(k) matching
- Flexible working hours across time zones`,
  },
  {
    title: 'Financial Analyst',
    company: 'Goldman Sachs',
    location: 'New York, USA',
    category: 'Finance',
    description: `Goldman Sachs is seeking a Financial Analyst for our Asset Management division.

Responsibilities:
- Build and maintain complex financial models for portfolio analysis
- Prepare investment memos and quarterly performance reports
- Conduct due diligence on potential investment opportunities
- Collaborate with senior analysts and portfolio managers

Requirements:
- Bachelor's degree in Finance, Economics, or Accounting
- 2+ years of financial modelling experience
- CFA Level I (or progress towards) preferred
- Proficiency in Excel, Bloomberg, and SQL

Benefits:
- Competitive salary with performance bonus
- Career development and sponsorship for CFA
- Comprehensive health and dental coverage
- Access to exclusive networking events`,
  },
  {
    title: 'Mobile Developer (React Native)',
    company: 'Grab',
    location: 'Singapore',
    category: 'Technology',
    description: `Grab is looking for a Mobile Developer to build features for Southeast Asia's leading superapp.

Responsibilities:
- Develop and ship new features in the Grab app (React Native)
- Optimize app performance and reduce crash rates
- Collaborate with product, design, and backend teams
- Write unit and integration tests to ensure code quality

Requirements:
- 3+ years of React Native development experience
- Strong knowledge of JavaScript/TypeScript and native modules
- Experience with state management (Redux, Zustand)
- Familiarity with iOS and Android deployment pipelines

Benefits:
- Flexible hybrid working arrangement
- Stock grants and annual bonus
- Medical, dental, and vision coverage
- Monthly transport and meal subsidies`,
  },
  {
    title: 'Content Strategist',
    company: 'Canva',
    location: 'Sydney, Australia',
    category: 'Marketing',
    description: `Canva is hiring a Content Strategist to lead content initiatives across our global blog and social channels.

Responsibilities:
- Develop and execute a content strategy that drives organic growth
- Manage a team of writers and freelancers
- Work with SEO specialists to identify high-impact content opportunities
- Track content performance and continuously optimise the editorial calendar

Requirements:
- 3+ years of content strategy or editorial experience
- Strong understanding of SEO principles
- Excellent writing and editing skills
- Experience with content management systems and analytics tools

Benefits:
- Equity in a fast-growing company
- $1,000 monthly wellness budget
- Dog-friendly Sydney office
- Generous parental leave`,
  },
  {
    title: 'Full Stack Engineer',
    company: 'Notion',
    location: 'Remote',
    category: 'Technology',
    description: `Notion is looking for a Full Stack Engineer to help build the all-in-one workspace used by millions.

Responsibilities:
- Build product features across the full stack (React, Node.js, PostgreSQL)
- Improve performance, reliability, and scalability of core systems
- Collaborate with product and design in a fast-paced environment
- Contribute to technical architecture discussions

Requirements:
- 3+ years of full-stack development experience
- Proficiency in React, TypeScript, and Node.js
- Experience with relational databases and query optimization
- Strong product sense and attention to detail

Benefits:
- Fully remote with biannual team offsites
- Competitive salary and equity
- $1,000 home office setup budget
- Monthly stipend for internet and phone`,
  },
  {
    title: 'Healthcare Data Analyst',
    company: 'Philips',
    location: 'Amsterdam, Netherlands',
    category: 'Healthcare',
    description: `Philips Health Systems is seeking a Healthcare Data Analyst to improve patient outcomes through data.

Responsibilities:
- Analyse clinical and operational datasets to identify improvement opportunities
- Build dashboards and reports for hospital clients using Power BI
- Work with clinical teams to define KPIs and data quality standards
- Support data governance and GDPR compliance initiatives

Requirements:
- Bachelor's degree in Health Informatics, Statistics, or related field
- 2+ years experience in healthcare analytics
- Proficiency in SQL, Python, and Power BI
- Understanding of HL7/FHIR data standards preferred

Benefits:
- Hybrid work (2 days remote)
- 30 vacation days per year
- Employee discounts on Philips products
- Comprehensive pension and wellness programme`,
  },
  {
    title: 'Cybersecurity Engineer',
    company: 'CrowdStrike',
    location: 'Austin, USA',
    category: 'Technology',
    description: `CrowdStrike is hiring a Cybersecurity Engineer to protect our platform and customers from advanced threats.

Responsibilities:
- Perform security reviews of infrastructure, APIs, and application code
- Develop automated security testing tools and integrate them into CI/CD pipelines
- Respond to and investigate security incidents
- Research emerging threats and implement proactive countermeasures

Requirements:
- 4+ years of cybersecurity engineering experience
- Deep knowledge of OWASP Top 10 and network security protocols
- Experience with SIEM tools, threat modelling, and penetration testing
- Security certifications (CISSP, CEH, OSCP) are a plus

Benefits:
- Remote-first culture
- Competitive RSU package
- $5,000 annual professional development budget
- Full health, dental, and vision coverage`,
  },
];

// ─── Exported helper called by initDb.js when the table is empty ─────────────
async function run(client) {
  for (const job of jobs) {
    await client.query(
      `INSERT INTO jobs (title, company, location, category, description)
       VALUES ($1, $2, $3, $4, $5)`,
      [job.title, job.company, job.location, job.category, job.description]
    );
  }
  console.log(`Seeded ${jobs.length} jobs.`);
}
exports.run = run;

// ─── Standalone execution: node src/config/seed.js ───────────────────────────
if (require.main === module) {
  (async () => {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM jobs');
      console.log('Cleared existing jobs');
      await run(client);
    } finally {
      client.release();
      if (pool.end) await pool.end();
    }
  })().catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
  });
}

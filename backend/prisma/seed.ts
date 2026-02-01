import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.application.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.student.deleteMany();
  await prisma.company.deleteMany();
  await prisma.administration.deleteMany();

  // Create Admin
  console.log('👤 Creating administration accounts...');
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.administration.create({
    data: {
      username: 'admin',
      email: 'admin@enetcom.tn',
      password: adminPassword,
    },
  });
  console.log(`   ✅ Admin created: ${admin.email}`);

  // Create Companies
  console.log('\n🏢 Creating company accounts...');
  const companyPassword = await hashPassword('company123');
  
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'TechnoSoft Tunisia',
        email: 'contact@technosoft.tn',
        password: companyPassword,
        sector: 'Software Development',
        description: 'Leading software development company in Tunisia, specializing in web and mobile applications.',
        isApproved: true,
        website: 'https://technosoft.tn',
        phone: '+216 71 123 456',
        address: 'Technopole El Ghazala, Ariana, Tunisia',
      },
    }),
    prisma.company.create({
      data: {
        name: 'DataSphere Analytics',
        email: 'hr@datasphere.tn',
        password: companyPassword,
        sector: 'Data Science & AI',
        description: 'Data analytics and artificial intelligence solutions provider.',
        isApproved: true,
        website: 'https://datasphere.tn',
        phone: '+216 71 234 567',
        address: 'Lac 2, Tunis, Tunisia',
      },
    }),
    prisma.company.create({
      data: {
        name: 'CloudNet Systems',
        email: 'careers@cloudnet.tn',
        password: companyPassword,
        sector: 'Cloud Computing',
        description: 'Cloud infrastructure and DevOps consulting company.',
        isApproved: true,
        website: 'https://cloudnet.tn',
        phone: '+216 71 345 678',
        address: 'Centre Urbain Nord, Tunis, Tunisia',
      },
    }),
    prisma.company.create({
      data: {
        name: 'CyberShield Security',
        email: 'jobs@cybershield.tn',
        password: companyPassword,
        sector: 'Cybersecurity',
        description: 'Cybersecurity consulting and penetration testing services.',
        isApproved: true,
        website: 'https://cybershield.tn',
        phone: '+216 71 456 789',
        address: 'Sfax, Tunisia',
      },
    }),
    prisma.company.create({
      data: {
        name: 'MobileFirst TN',
        email: 'recrutement@mobilefirst.tn',
        password: companyPassword,
        sector: 'Mobile Development',
        description: 'Mobile-first development agency creating innovative apps.',
        isApproved: true,
        website: 'https://mobilefirst.tn',
        phone: '+216 71 567 890',
        address: 'Sousse, Tunisia',
      },
    }),
    prisma.company.create({
      data: {
        name: 'IoT Solutions Maghreb',
        email: 'contact@iotsolutions.tn',
        password: companyPassword,
        sector: 'IoT & Embedded Systems',
        description: 'Internet of Things and embedded systems solutions.',
        isApproved: false, // Pending approval
        website: 'https://iotsolutions.tn',
        phone: '+216 71 678 901',
        address: 'Monastir, Tunisia',
      },
    }),
  ]);
  
  companies.forEach((c) => {
    console.log(`   ✅ Company created: ${c.name} (${c.isApproved ? 'Approved' : 'Pending'})`);
  });

  // Create Students
  console.log('\n🎓 Creating student accounts...');
  const studentPassword = await hashPassword('student123');
  
  const studentsData = [
    { firstName: 'Ahmed', lastName: 'Ben Ali', email: 'ahmed.benali@enetcom.tn', studyLevel: 'Master 2', groupName: 'GL', skills: 'JavaScript, TypeScript, Angular, Node.js, React' },
    { firstName: 'Fatma', lastName: 'Trabelsi', email: 'fatma.trabelsi@enetcom.tn', studyLevel: 'Master 1', groupName: 'RT', skills: 'Python, TensorFlow, Machine Learning, Data Analysis' },
    { firstName: 'Mohamed', lastName: 'Hammami', email: 'mohamed.hammami@enetcom.tn', studyLevel: '3rd Year', groupName: 'TIC', skills: 'Java, Spring Boot, MySQL, Docker' },
    { firstName: 'Amira', lastName: 'Souissi', email: 'amira.souissi@enetcom.tn', studyLevel: 'Master 2', groupName: 'GL', skills: 'React, Vue.js, CSS, Figma, UI/UX Design' },
    { firstName: 'Yassine', lastName: 'Khemiri', email: 'yassine.khemiri@enetcom.tn', studyLevel: '3rd Year', groupName: 'RT', skills: 'Network Security, Linux, Cisco, AWS' },
    { firstName: 'Mariem', lastName: 'Belhadj', email: 'mariem.belhadj@enetcom.tn', studyLevel: 'Master 1', groupName: 'TIC', skills: 'PHP, Laravel, MySQL, WordPress' },
    { firstName: 'Amine', lastName: 'Jebali', email: 'amine.jebali@enetcom.tn', studyLevel: '2nd Year', groupName: 'GL', skills: 'C++, Python, Algorithms, Data Structures' },
    { firstName: 'Sarra', lastName: 'Mansouri', email: 'sarra.mansouri@enetcom.tn', studyLevel: 'Master 2', groupName: 'RT', skills: 'IoT, Arduino, Raspberry Pi, Embedded Systems' },
    { firstName: 'Khalil', lastName: 'Bouazizi', email: 'khalil.bouazizi@enetcom.tn', studyLevel: '3rd Year', groupName: 'TIC', skills: 'Flutter, Dart, Firebase, Mobile Development' },
    { firstName: 'Nour', lastName: 'Gharbi', email: 'nour.gharbi@enetcom.tn', studyLevel: 'Master 1', groupName: 'GL', skills: 'DevOps, Kubernetes, Jenkins, CI/CD' },
    { firstName: 'Oussama', lastName: 'Ferchichi', email: 'oussama.ferchichi@enetcom.tn', studyLevel: '2nd Year', groupName: 'RT', skills: 'SQL, NoSQL, Database Administration' },
    { firstName: 'Rania', lastName: 'Mejri', email: 'rania.mejri@enetcom.tn', studyLevel: '3rd Year', groupName: 'TIC', skills: 'Angular, .NET, C#, Azure' },
  ];

  const students = await Promise.all(
    studentsData.map((s) =>
      prisma.student.create({
        data: {
          ...s,
          password: studentPassword,
        },
      })
    )
  );
  
  students.forEach((s) => {
    console.log(`   ✅ Student created: ${s.firstName} ${s.lastName} (${s.studyLevel} - ${s.groupName})`);
  });

  // Create Offers
  console.log('\n📋 Creating job offers...');
  
  const offersData = [
    {
      title: 'Full Stack Developer - PFE',
      category: 'PFE' as const,
      description: 'We are looking for a talented Full Stack Developer for a 6-month PFE project. You will work on developing a modern web application using Angular and Node.js. This is an excellent opportunity to gain hands-on experience with cutting-edge technologies.',
      requirements: 'Strong knowledge of JavaScript/TypeScript, Angular, Node.js, and SQL databases. Good communication skills and ability to work in a team.',
      location: 'Tunis, Tunisia',
      duration: '6 months',
      status: 'ACTIVE' as const,
      companyId: companies[0].id,
    },
    {
      title: 'Data Science Intern',
      category: 'SUMMER_INTERNSHIP' as const,
      description: 'Join our data science team for a summer internship. You will work on real-world machine learning projects and learn from experienced professionals.',
      requirements: 'Python, pandas, scikit-learn, basic understanding of machine learning algorithms. Statistics background is a plus.',
      location: 'Tunis, Tunisia',
      duration: '2 months',
      status: 'ACTIVE' as const,
      companyId: companies[1].id,
    },
    {
      title: 'Junior Cloud Engineer',
      category: 'JOB' as const,
      description: 'We are hiring a Junior Cloud Engineer to join our growing team. You will help manage cloud infrastructure and implement DevOps practices.',
      requirements: 'AWS or Azure certification preferred. Experience with Docker, Kubernetes, and CI/CD pipelines.',
      location: 'Remote / Tunis',
      duration: 'Full-time',
      salary: '1500-2000 TND',
      status: 'ACTIVE' as const,
      companyId: companies[2].id,
    },
    {
      title: 'Cybersecurity Analyst - PFE',
      category: 'PFE' as const,
      description: 'Conduct security assessments and penetration testing as part of your PFE. Learn about real-world security challenges and solutions.',
      requirements: 'Knowledge of network security, Linux, basic scripting. CEH or similar certification is a plus.',
      location: 'Sfax, Tunisia',
      duration: '4 months',
      status: 'ACTIVE' as const,
      companyId: companies[3].id,
    },
    {
      title: 'Mobile Developer Intern (Flutter)',
      category: 'SUMMER_INTERNSHIP' as const,
      description: 'Develop cross-platform mobile applications using Flutter. Work on exciting projects and expand your mobile development skills.',
      requirements: 'Flutter/Dart experience, understanding of mobile UI/UX principles, Firebase knowledge is a plus.',
      location: 'Sousse, Tunisia',
      duration: '3 months',
      status: 'ACTIVE' as const,
      companyId: companies[4].id,
    },
    {
      title: 'Backend Developer - Node.js',
      category: 'JOB' as const,
      description: 'Looking for a Backend Developer to build scalable APIs and microservices. You will work with modern technologies and agile methodologies.',
      requirements: 'Strong Node.js/Express skills, MongoDB or PostgreSQL, experience with REST APIs and GraphQL.',
      location: 'Tunis, Tunisia',
      duration: 'Full-time',
      salary: '1800-2500 TND',
      status: 'ACTIVE' as const,
      companyId: companies[0].id,
    },
    {
      title: 'AI Research Assistant - PFE',
      category: 'PFE' as const,
      description: 'Contribute to AI research projects focusing on NLP and computer vision. Great opportunity for students interested in AI/ML.',
      requirements: 'Strong Python skills, experience with PyTorch or TensorFlow, academic research experience is a plus.',
      location: 'Tunis, Tunisia',
      duration: '6 months',
      status: 'ACTIVE' as const,
      companyId: companies[1].id,
    },
    {
      title: 'Frontend Developer (React)',
      category: 'JOB' as const,
      description: 'Join our frontend team to build beautiful and responsive web applications using React and modern CSS.',
      requirements: 'React, Redux, HTML5, CSS3, responsive design. Experience with TypeScript is a plus.',
      location: 'Remote',
      duration: 'Full-time',
      salary: '1600-2200 TND',
      status: 'ACTIVE' as const,
      companyId: companies[0].id,
    },
    {
      title: 'Network Engineering Intern',
      category: 'SUMMER_INTERNSHIP' as const,
      description: 'Learn about enterprise networking and gain hands-on experience with Cisco equipment and cloud networking.',
      requirements: 'CCNA certification or equivalent knowledge, understanding of TCP/IP, routing and switching.',
      location: 'Tunis, Tunisia',
      duration: '2 months',
      status: 'ACTIVE' as const,
      companyId: companies[2].id,
    },
    {
      title: 'DevSecOps Engineer - PFE',
      category: 'PFE' as const,
      description: 'Integrate security practices into the DevOps pipeline. Learn about secure software development lifecycle.',
      requirements: 'Knowledge of DevOps tools, security scanning tools, scripting skills (Bash/Python).',
      location: 'Sfax, Tunisia',
      duration: '5 months',
      status: 'CLOSED' as const,
      companyId: companies[3].id,
    },
  ];

  const offers = await Promise.all(
    offersData.map((o) =>
      prisma.offer.create({
        data: o,
      })
    )
  );
  
  offers.forEach((o) => {
    console.log(`   ✅ Offer created: ${o.title} (${o.category})`);
  });

  // Create Applications
  console.log('\n📝 Creating sample applications...');
  
  const applicationsData = [
    { studentId: students[0].id, offerId: offers[0].id, status: 'PENDING' as const, coverLetter: 'I am very interested in this Full Stack Developer position...' },
    { studentId: students[1].id, offerId: offers[1].id, status: 'ACCEPTED' as const, coverLetter: 'As a data science enthusiast, I would love to join your team...' },
    { studentId: students[2].id, offerId: offers[2].id, status: 'PENDING' as const, coverLetter: 'I have been working with cloud technologies and would be a great fit...' },
    { studentId: students[3].id, offerId: offers[7].id, status: 'PENDING' as const, coverLetter: 'Frontend development is my passion and I love React...' },
    { studentId: students[4].id, offerId: offers[3].id, status: 'REJECTED' as const, coverLetter: 'I am interested in cybersecurity and have completed several courses...' },
    { studentId: students[5].id, offerId: offers[0].id, status: 'PENDING' as const, coverLetter: 'I have experience with Laravel and would love to expand to Node.js...' },
    { studentId: students[6].id, offerId: offers[6].id, status: 'PENDING' as const, coverLetter: 'AI and machine learning are fields I am deeply passionate about...' },
    { studentId: students[7].id, offerId: offers[8].id, status: 'ACCEPTED' as const, coverLetter: 'Network engineering has always fascinated me...' },
    { studentId: students[8].id, offerId: offers[4].id, status: 'PENDING' as const, coverLetter: 'I have been developing Flutter apps and would love this opportunity...' },
    { studentId: students[9].id, offerId: offers[2].id, status: 'PENDING' as const, coverLetter: 'DevOps and cloud infrastructure are my areas of expertise...' },
  ];

  const applications = await Promise.all(
    applicationsData.map((a) =>
      prisma.application.create({
        data: a,
      })
    )
  );
  
  console.log(`   ✅ Created ${applications.length} applications`);

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('✅ Database seeding completed successfully!');
  console.log('════════════════════════════════════════════════════════════');
  console.log('\n📋 Summary:');
  console.log(`   • 1 Admin account (admin@enetcom.tn / admin123)`);
  console.log(`   • ${companies.length} Companies (password: company123)`);
  console.log(`   • ${students.length} Students (password: student123)`);
  console.log(`   • ${offers.length} Job Offers`);
  console.log(`   • ${applications.length} Applications\n`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

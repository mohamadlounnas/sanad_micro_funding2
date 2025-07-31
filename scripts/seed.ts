import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with demo data...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ahmed@example.com' },
      update: {},
      create: {
        email: 'ahmed@example.com',
        password: hashedPassword,
        name: 'أحمد محمد',
        role: 'ENTREPRENEUR',
        phone: '+213 555 123 456'
      }
    }),
    prisma.user.upsert({
      where: { email: 'fatima@example.com' },
      update: {},
      create: {
        email: 'fatima@example.com',
        password: hashedPassword,
        name: 'فاطمة الزهراء',
        role: 'ENTREPRENEUR',
        phone: '+213 555 789 012'
      }
    }),
    prisma.user.upsert({
      where: { email: 'ali@example.com' },
      update: {},
      create: {
        email: 'ali@example.com',
        password: hashedPassword,
        name: 'علي بن عبد الله',
        role: 'INVESTOR',
        phone: '+213 555 345 678'
      }
    }),
    prisma.user.upsert({
      where: { email: 'khadija@example.com' },
      update: {},
      create: {
        email: 'khadija@example.com',
        password: hashedPassword,
        name: 'خديجة بنت محمد',
        role: 'INVESTOR',
        phone: '+213 555 901 234'
      }
    })
  ])

  console.log('✅ Created demo users')

  // Create demo projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 'project-1' },
      update: {},
      create: {
        id: 'project-1',
        title: 'مقهى تراثي في قلب الجزائر العاصمة',
        description: 'مشروع مقهى تراثي يجمع بين الأصالة والحداثة، يقدم القهوة العربية التقليدية مع الحلويات الشرقية في جو عائلي دافئ. المقهى سيكون في منطقة سياحية مهمة مع إمكانية التوسع لاحقاً.',
        category: 'FOOD_AND_BEVERAGE',
        targetAmount: 1500000,
        raisedAmount: 850000,
        equityPercentage: 25,
        endDate: new Date('2024-06-15'),
        status: 'ACTIVE',
        ownerId: users[0].id
      }
    }),
    prisma.project.upsert({
      where: { id: 'project-2' },
      update: {},
      create: {
        id: 'project-2',
        title: 'تطبيق تعليمي للأطفال باللغة العربية',
        description: 'تطبيق تفاعلي لتعليم الأطفال القراءة والكتابة باللغة العربية بطريقة ممتعة وجذابة. التطبيق سيشمل ألعاب تعليمية وقصص تفاعلية مع إمكانية التوسع ليشمل الرياضيات والعلوم.',
        category: 'TECHNOLOGY',
        targetAmount: 800000,
        raisedAmount: 520000,
        equityPercentage: 30,
        endDate: new Date('2024-05-20'),
        status: 'ACTIVE',
        ownerId: users[1].id
      }
    }),
    prisma.project.upsert({
      where: { id: 'project-3' },
      update: {},
      create: {
        id: 'project-3',
        title: 'مصنع صغير للملابس التقليدية',
        description: 'مشروع مصنع صغير لإنتاج الملابس التقليدية الجزائرية مثل القفطان والجلابة. المصنع سيوظف نساء من المنطقة ويساعد في الحفاظ على التراث الثقافي مع إدخال تحسينات عصرية.',
        category: 'MANUFACTURING',
        targetAmount: 2000000,
        raisedAmount: 1200000,
        equityPercentage: 20,
        endDate: new Date('2024-07-10'),
        status: 'ACTIVE',
        ownerId: users[0].id
      }
    }),
    prisma.project.upsert({
      where: { id: 'project-4' },
      update: {},
      create: {
        id: 'project-4',
        title: 'خدمة توصيل طعام محلية',
        description: 'منصة رقمية لربط المطاعم المحلية مع العملاء، مع خدمة توصيل سريعة وموثوقة. المشروع سيشمل تطبيق جوال وموقع إلكتروني مع نظام دفع آمن.',
        category: 'SERVICES',
        targetAmount: 1200000,
        raisedAmount: 750000,
        equityPercentage: 35,
        endDate: new Date('2024-06-30'),
        status: 'ACTIVE',
        ownerId: users[1].id
      }
    }),
    prisma.project.upsert({
      where: { id: 'project-5' },
      update: {},
      create: {
        id: 'project-5',
        title: 'مزرعة عضوية للخضروات',
        description: 'مشروع مزرعة عضوية لإنتاج الخضروات والفواكه الطازجة بدون مبيدات كيميائية. المزرعة ستستخدم تقنيات الزراعة الحديثة مع الحفاظ على البيئة.',
        category: 'AGRICULTURE',
        targetAmount: 900000,
        raisedAmount: 480000,
        equityPercentage: 40,
        endDate: new Date('2024-05-15'),
        status: 'ACTIVE',
        ownerId: users[0].id
      }
    })
  ])

  console.log('✅ Created demo projects')

  // Create demo investments
  const investments = await Promise.all([
    prisma.investment.upsert({
      where: { id: 'investment-1' },
      update: {},
      create: {
        id: 'investment-1',
        amount: 50000,
        equityPercentage: (50000 / 1500000) * 25, // 0.83%
        status: 'ACTIVE',
        investorId: users[2].id,
        projectId: projects[0].id
      }
    }),
    prisma.investment.upsert({
      where: { id: 'investment-2' },
      update: {},
      create: {
        id: 'investment-2',
        amount: 75000,
        equityPercentage: (75000 / 800000) * 30, // 2.81%
        status: 'ACTIVE',
        investorId: users[3].id,
        projectId: projects[1].id
      }
    }),
    prisma.investment.upsert({
      where: { id: 'investment-3' },
      update: {},
      create: {
        id: 'investment-3',
        amount: 100000,
        equityPercentage: (100000 / 2000000) * 20, // 1%
        status: 'ACTIVE',
        investorId: users[2].id,
        projectId: projects[2].id
      }
    }),
    prisma.investment.upsert({
      where: { id: 'investment-4' },
      update: {},
      create: {
        id: 'investment-4',
        amount: 60000,
        equityPercentage: (60000 / 1200000) * 35, // 1.75%
        status: 'ACTIVE',
        investorId: users[3].id,
        projectId: projects[3].id
      }
    })
  ])

  console.log('✅ Created demo investments')
  console.log('🎉 Database seeded successfully!')

  console.log('\n📋 Demo Accounts:')
  console.log('Entrepreneurs:')
  console.log('- ahmed@example.com / password123')
  console.log('- fatima@example.com / password123')
  console.log('Investors:')
  console.log('- ali@example.com / password123')
  console.log('- khadija@example.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
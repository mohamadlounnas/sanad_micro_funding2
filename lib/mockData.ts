// Mock data for Sanad platform demo
export const mockUsers = [
  {
    id: 'user-1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    role: 'ENTREPRENEUR',
    phone: '+213 555 123 456'
  },
  {
    id: 'user-2',
    name: 'فاطمة الزهراء',
    email: 'fatima@example.com',
    role: 'ENTREPRENEUR',
    phone: '+213 555 789 012'
  },
  {
    id: 'user-3',
    name: 'علي بن عبد الله',
    email: 'ali@example.com',
    role: 'INVESTOR',
    phone: '+213 555 345 678'
  },
  {
    id: 'user-4',
    name: 'خديجة بنت محمد',
    email: 'khadija@example.com',
    role: 'INVESTOR',
    phone: '+213 555 901 234'
  }
]

export const mockProjects = [
  {
    id: 'project-1',
    title: 'مقهى تراثي في قلب الجزائر العاصمة',
    description: 'مشروع مقهى تراثي يجمع بين الأصالة والحداثة، يقدم القهوة العربية التقليدية مع الحلويات الشرقية في جو عائلي دافئ. المقهى سيكون في منطقة سياحية مهمة مع إمكانية التوسع لاحقاً.',
    category: 'FOOD_AND_BEVERAGE',
    targetAmount: 1500000,
    raisedAmount: 850000,
    equityPercentage: 25,
    endDate: new Date('2024-06-15'),
    status: 'ACTIVE',
    ownerId: 'user-1',
    owner: { name: 'أحمد محمد', email: 'ahmed@example.com' },
    daysLeft: 45,
    investorsCount: 12,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    location: 'الجزائر العاصمة',
    businessPlan: 'المقهى سيكون في منطقة سياحية مهمة في قلب العاصمة، مع تصميم تراثي يجمع بين الأصالة والحداثة. سيوفر المقهى قائمة متنوعة من القهوة العربية التقليدية والحلويات الشرقية، مع جو عائلي دافئ يجذب السياح والمحليين على حد سواء.',
    financialProjections: 'يتوقع المشروع تحقيق عوائد سنوية تتراوح بين 20-30% للمستثمرين، مع نمو مستدام في السوق السياحي المتنامي في الجزائر.',
    team: [
      'أحمد محمد - المدير التنفيذي',
      'فاطمة علي - مدير المطبخ',
      'محمد حسن - مدير التسويق',
      'سارة أحمد - مدير الخدمة'
    ],
    risks: [
      'تقلبات الموسم السياحي',
      'التغييرات في أذواق العملاء',
      'المنافسة من المقاهي الأخرى',
      'ارتفاع تكاليف التشغيل'
    ],
    milestones: [
      {
        title: 'إعداد الموقع',
        description: 'تجهيز المقهى بالتصميم التراثي',
        targetDate: '2024-03-01',
        amount: 500000
      },
      {
        title: 'افتتاح المقهى',
        description: 'الافتتاح الرسمي للمقهى',
        targetDate: '2024-04-01',
        amount: 800000
      },
      {
        title: 'التوسع',
        description: 'افتتاح فرع ثاني',
        targetDate: '2024-12-01',
        amount: 1200000
      }
    ]
  },
  {
    id: 'project-2',
    title: 'تطبيق تعليمي للأطفال باللغة العربية',
    description: 'تطبيق تفاعلي لتعليم الأطفال القراءة والكتابة باللغة العربية بطريقة ممتعة وجذابة. التطبيق سيشمل ألعاب تعليمية وقصص تفاعلية مع إمكانية التوسع ليشمل الرياضيات والعلوم.',
    category: 'TECHNOLOGY',
    targetAmount: 800000,
    raisedAmount: 520000,
    equityPercentage: 30,
    endDate: new Date('2024-05-20'),
    status: 'ACTIVE',
    ownerId: 'user-2',
    owner: { name: 'فاطمة الزهراء', email: 'fatima@example.com' },
    daysLeft: 32,
    investorsCount: 8,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    location: 'وهران',
    businessPlan: 'التطبيق سيكون متاحاً على منصات iOS وAndroid، مع واجهة مستخدم بسيطة وجذابة للأطفال. سيشمل التطبيق ألعاب تفاعلية وقصص تعليمية مع نظام مكافآت لتحفيز الأطفال على التعلم.',
    financialProjections: 'يتوقع المشروع تحقيق عوائد سنوية تتراوح بين 25-35% للمستثمرين، مع نمو سريع في سوق التطبيقات التعليمية.',
    team: [
      'فاطمة الزهراء - المدير التنفيذي',
      'علي أحمد - مدير التطوير',
      'خديجة محمد - مصمم واجهات المستخدم',
      'محمد علي - مدير المحتوى التعليمي'
    ],
    risks: [
      'التغييرات في سياسات منصات التطبيقات',
      'المنافسة من التطبيقات الدولية',
      'صعوبة الحصول على تراخيص المحتوى',
      'تحديات التوزيع والتسويق'
    ],
    milestones: [
      {
        title: 'تطوير النسخة التجريبية',
        description: 'إطلاق النسخة الأولى من التطبيق',
        targetDate: '2024-03-15',
        amount: 300000
      },
      {
        title: 'إطلاق التطبيق',
        description: 'الوصول إلى 1000 مستخدم نشط',
        targetDate: '2024-04-15',
        amount: 500000
      },
      {
        title: 'التوسع',
        description: 'إضافة ميزات جديدة ولغات إضافية',
        targetDate: '2024-08-01',
        amount: 800000
      }
    ]
  },
  {
    id: 'project-3',
    title: 'مصنع صغير للملابس التقليدية',
    description: 'مشروع مصنع صغير لإنتاج الملابس التقليدية الجزائرية مثل القفطان والجلابة. المصنع سيوظف نساء من المنطقة ويساعد في الحفاظ على التراث الثقافي مع إدخال تحسينات عصرية.',
    category: 'MANUFACTURING',
    targetAmount: 2000000,
    raisedAmount: 1200000,
    equityPercentage: 20,
    endDate: new Date('2024-07-10'),
    status: 'ACTIVE',
    ownerId: 'user-1',
    owner: { name: 'أحمد محمد' },
    daysLeft: 70,
    investorsCount: 15,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 'project-4',
    title: 'خدمة توصيل طعام محلية',
    description: 'منصة رقمية لربط المطاعم المحلية مع العملاء، مع خدمة توصيل سريعة وموثوقة. المشروع سيشمل تطبيق جوال وموقع إلكتروني مع نظام دفع آمن.',
    category: 'SERVICES',
    targetAmount: 1200000,
    raisedAmount: 750000,
    equityPercentage: 35,
    endDate: new Date('2024-06-30'),
    status: 'ACTIVE',
    ownerId: 'user-2',
    owner: { name: 'فاطمة الزهراء' },
    daysLeft: 60,
    investorsCount: 10,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'project-5',
    title: 'مزرعة عضوية للخضروات',
    description: 'مشروع مزرعة عضوية لإنتاج الخضروات والفواكه الطازجة بدون مبيدات كيميائية. المزرعة ستستخدم تقنيات الزراعة الحديثة مع الحفاظ على البيئة.',
    category: 'AGRICULTURE',
    targetAmount: 900000,
    raisedAmount: 480000,
    equityPercentage: 40,
    endDate: new Date('2024-05-15'),
    status: 'ACTIVE',
    ownerId: 'user-1',
    owner: { name: 'أحمد محمد' },
    daysLeft: 27,
    investorsCount: 6,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
]

export const mockInvestments = [
  {
    id: 'investment-1',
    amount: 50000,
    status: 'ACTIVE',
    returnAmount: null,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    investorId: 'user-3',
    projectId: 'project-1',
    project: {
      id: 'project-1',
      title: 'مقهى تراثي في قلب الجزائر العاصمة',
      category: 'FOOD_AND_BEVERAGE',
      status: 'ACTIVE'
    }
  },
  {
    id: 'investment-2',
    amount: 75000,
    status: 'ACTIVE',
    returnAmount: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    investorId: 'user-4',
    projectId: 'project-2',
    project: {
      id: 'project-2',
      title: 'تطبيق تعليمي للأطفال باللغة العربية',
      category: 'TECHNOLOGY',
      status: 'ACTIVE'
    }
  },
  {
    id: 'investment-3',
    amount: 100000,
    status: 'ACTIVE',
    returnAmount: null,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    investorId: 'user-3',
    projectId: 'project-3',
    project: {
      id: 'project-3',
      title: 'مصنع صغير للملابس التقليدية',
      category: 'MANUFACTURING',
      status: 'ACTIVE'
    }
  },
  {
    id: 'investment-4',
    amount: 60000,
    status: 'ACTIVE',
    returnAmount: null,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    investorId: 'user-4',
    projectId: 'project-4',
    project: {
      id: 'project-4',
      title: 'خدمة توصيل طعام محلية',
      category: 'SERVICES',
      status: 'ACTIVE'
    }
  }
]

export const mockStats = {
  investor: {
    totalInvested: 285000,
    activeInvestments: 4,
    totalReturn: 0
  },
  entrepreneur: {
    totalRaised: 3800000,
    activeProjects: 5,
    totalInvestors: 51
  }
}

// Helper function to get mock data based on user role
export function getMockData(userId: string, role: string) {
  if (role === 'INVESTOR') {
    const userInvestments = mockInvestments.filter(inv => inv.investorId === userId)
    const availableProjects = mockProjects.filter(project => project.ownerId !== userId)
    
    return {
      projects: availableProjects,
      investments: userInvestments,
      stats: mockStats.investor
    }
  } else {
    const userProjects = mockProjects.filter(project => project.ownerId === userId)
    
    return {
      projects: userProjects,
      stats: mockStats.entrepreneur
    }
  }
} 
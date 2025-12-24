// src/utils/constants.js

export const SUTRA_LIST = [
  { key: 'Namokar Mantra', name: 'णमोकार मंत्र (Namokar Mantra)' },
  { key: 'Pratikraman Sutra', name: 'प्रतिक्रमण सूत्र (Pratikraman Sutra)' },
  { key: 'Samayik Sutra', name: 'सामायिक सूत्र (Samayik Sutra)' },
  { key: 'Bhaktamar Stotra', name: 'भक्तामर स्तोत्र (Bhaktamar Stotra)' },
  { key: 'Kalyan Mandir Stotra', name: 'कल्याण मंदिर स्तोत्र (Kalyan Mandir Stotra)' },
  { key: 'Logassa Sutra', name: 'लोगस्स सूत्र (Logassa Sutra)' },
  { key: 'Uvasagharam Stotra', name: 'उवसग्गहरं स्तोत्र (Uvasagharam Stotra)' },
  { key: 'Dashvaikalik Sutra', name: 'दशवैकालिक सूत्र (Dashvaikalik Sutra)' },
  { key: 'Uttaradhyayan Sutra', name: 'उत्तराध्ययन सूत्र (Uttaradhyayan Sutra)' },
  { key: 'Tattvartha Sutra', name: 'तत्त्वार्थ सूत्र (Tattvartha Sutra)' },
  { key: 'Sthanang Sutra', name: 'स्थानांग सूत्र (Sthanang Sutra)' },
  { key: 'Other', name: 'अन्य (Other)' }
];

export const GATHA_TYPES = {
  NEW: 'new',
  REVISION: 'revision'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
  GU: 'gu'
};

export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
];

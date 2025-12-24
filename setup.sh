#!/bin/bash
mkdir -p public/locales/{en,hi,gu} src/{assets/images,components/{common,user,admin,reports},contexts,hooks,pages,services,utils,i18n}

touch public/{index.html,favicon.ico,manifest.json}
echo '{"welcome":"Welcome"}' > public/locales/en/translation.json
echo '{"welcome":"स्वागत"}' > public/locales/hi/translation.json  
echo '{"welcome":"સ્વાગત"}' > public/locales/gu/translation.json

# Components
for f in Navbar Sidebar Loading ProtectedRoute LanguageSelector Modal ConfirmDialog; do
  echo "import React from 'react'; export default () => <div>$f</div>;" > src/components/common/$f.jsx
  touch src/components/common/$f.css
done

for f in MemberSelector AttendanceForm GathaForm HistoryTable; do
  echo "import React from 'react'; export default () => <div>$f</div>;" > src/components/user/$f.jsx
  touch src/components/user/$f.css
done

for f in PendingApprovals StudentsList StudentDetail AddMemberModal BulkActions; do
  echo "import React from 'react'; export default () => <div>$f</div>;" > src/components/admin/$f.jsx
  touch src/components/admin/$f.css
done

for f in AttendanceReport GathaChart MonthlyReport ExportButtons; do
  echo "import React from 'react'; export default () => <div>$f</div>;" > src/components/reports/$f.jsx
  [[ $f != "ExportButtons" ]] && touch src/components/reports/$f.css
done

# Pages
for f in LoginPage UserDashboard UserHistory AdminDashboard AdminStudents AdminReports ManageMembers; do
  echo "import React from 'react'; export default () => <div>$f</div>;" > src/pages/$f.jsx
  touch src/pages/$f.css
done

# Other files
echo "export const AuthContext = null;" > src/contexts/AuthContext.jsx
echo "export const LanguageContext = null;" > src/contexts/LanguageContext.jsx
touch src/hooks/{useFirestore.js,useExport.js}
touch src/services/firebase.js
touch src/utils/{constants.js,helpers.js,exportUtils.js}
touch src/i18n/index.js
echo "import React from 'react'; export default () => <div>App</div>;" > src/App.jsx
touch src/{App.css,index.js,index.css}
touch .env.example .env .gitignore vercel.json README.md
touch src/assets/images/logo.png

echo "✅ Done!"

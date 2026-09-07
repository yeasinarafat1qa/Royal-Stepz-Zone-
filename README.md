# 🇶🇦 Royal Stepz Zone Qatar — Footwear E-Commerce

A modern, high-performance E-Commerce platform for footwear and sneakers in Qatar. Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Lucide Icons. Features full Amazon-style shopping, QAR currency checkout with WhatsApp confirmation, real-time cart/favorites persistence, and a secure Master Admin Dashboard.

---

## 🚀 কম্পিউটার এবং VS Code-এ লোকালি চালানোর নিয়মাবলী (Local Setup Guide)

### প্রয়োজনীয় সফটওয়্যার (Prerequisites):
- [Node.js](https://nodejs.org/) (Version 18 বা তার বেশি ইন্সটল করা থাকতে হবে)
- [VS Code](https://code.visualstudio.com/) (Visual Studio Code)

### স্টেপ ১: ফোল্ডারটি VS Code-এ ওপেন করুন
1. ডাউনলোড করা ZIP ফাইলটি আনজিপ (Extract) করুন।
2. **VS Code** ওপেন করে `File` > `Open Folder...` থেকে এই প্রজেক্ট ফোল্ডারটি সিলেক্ট করুন।

### স্টেপ ২: টার্মিনাল ওপেন করে ডিপেন্ডেন্সি ইন্সটল করুন
1. VS Code-এর ওপরের মেনু থেকে **Terminal** > **New Terminal** ওপেন করুন (অথবা কীবোর্ডে `Ctrl + ~` চাপুন)।
2. টার্মিনালে নিচের কমান্ডটি লিখে Enter দিন:
```bash
npm install
```
*(এটি প্রজেক্টের সব প্রয়োজনীয় প্যাকেজ যেমন React, Tailwind, Lucide ইত্যাদি ডাউনলোড করে নেবে।)*

### স্টেপ ৩: প্রজেক্ট রান (Start) করুন
ইন্সটল শেষ হলে নিচের কমান্ড দিন:
```bash
npm run dev
```

### স্টেপ ৪: ব্রাউজারে দেখুন
টার্মিনালে লোকাল লিঙ্ক দেখতে পাবেন:
```
➜  Local:   http://localhost:3000/
```
যেকোনো ব্রাউজারে (Chrome, Edge ইত্যাদি) গিয়ে `http://localhost:3000` ওপেন করলেই ওয়েবসাইটটি দেখতে পাবেন।

---

## 👑 মাস্টার অ্যাডমিন পোর্টাল ও সিকিউরিটি ক্রেডেনশিয়াল (Admin Access)

- **শর্টকাট**: ওয়েবসাইট ওপেন থাকা অবস্থায় কীবোর্ড থেকে **`Ctrl + Shift + A`** (ম্যাকে `Cmd + Shift + A`) চাপলেই গোপন অ্যাডমিন গেট ওপেন হবে।
- **মাস্টার জিমেইল**: `yeasinarafat1.qa@gmail.com`
- **মাস্টার পাসওয়ার্ড**: `Ar@2925`
- **সুবিধা**:
  - পণ্যের দাম এক ক্লিকে কমানো/বাড়ানো (`+10`, `-10`, `+50`, `-50` QAR)
  - যেকোনো পণ্যের নাম, সাইজ, রঙ, ছবি পরিবর্তন ও কাস্টমাইজেশন
  - নতুন জুতা আপলোড ও পাবলিশ
  - কাস্টমারদের সমস্ত অর্ডার দেখা ও সরাসরি WhatsApp এ যোগাযোগ করা
  - **🔥 Firebase Cloud Database**: সমস্ত ডেটা ক্লাউডে স্থায়ীভাবে সেভ থাকে, যেকোনো ডিভাইস থেকে রিয়েল-টাইমে আপডেট হয়!

---

## 🔥 Firebase Cloud Database (লাইভ ক্লাউড ডাটাবেজ)

প্রজেক্টটিতে অফিশিয়াল **Google Firebase Firestore** ডাটাবেজ ইন্টিগ্রেট করা হয়েছে:
- **Project ID**: `premium-odyssey-rpthm`
- **সুবিধা**: আপনি যেকোনো ডিভাইস থেকে দাম পরিবর্তন বা নতুন জুতা যুক্ত করলে ক্লাউডে চিরস্থায়ীভাবে সেভ হয়ে যাবে। ব্রাউজার ক্যাশ ক্লিয়ার করলেও ডেটা মুছবে না।
- **স্বয়ংক্রিয় ব্যাকআপ**: আপনার সব অর্ডার ও প্রোডাক্ট রিয়েল-টাইমে ক্লাউড এবং ব্রাউজারে ব্যাকআপ হিসেবে থাকে।

---

## 🌐 GitHub-এ আপলোড ও পাবলিক ওয়েবসাইট রান করার নিয়ম (Publish to GitHub & Web)

### ধাপ ১: GitHub-এ রিপোজিটরি তৈরি করুন
1. [GitHub](https://github.com/) এ গিয়ে লগইন করুন।
2. নতুন একটি রিপোজিটরি তৈরি করুন (যেমন: `royal-stepz-zone-qatar`), এটি **Public** রাখুন।

### ধাপ ২: VS Code টার্মিনাল থেকে কোড পুশ করুন
আপনার VS Code টার্মিনালে নিচের কমান্ডগুলো ক্রমান্বয়ে দিন:
```bash
git init
git add .
git commit -m "Initial commit - Royal Stepz Zone Qatar"
git branch -M main
git remote add origin https://github.com/<your-username>/royal-stepz-zone-qatar.git
git push -u origin main
```
*(যেখানে `<your-username>` আপনার গিটহাব ইউজারনেম হবে)*

---

### ধাপ ৩: একদম ফ্রি-তে পাবলিক লাইভ ওয়েবসাইট চালু করা (Recommended: Vercel)

Vite ও React প্রজেক্টের জন্য সবচেয়ে দ্রুত এবং অটোমেটিক ফ্রি হোস্টিং হলো **Vercel**:
1. [Vercel](https://vercel.com/) এ গিয়ে **Continue with GitHub** দিয়ে লগইন করুন।
2. **Add New Project** এ ক্লিক করে আপনার GitHub রিপোজিটরিটি (`royal-stepz-zone-qatar`) সিলেক্ট করুন।
3. **Deploy** বাটনে ক্লিক করুন।
4. ১ মিনিটের মধ্যেই আপনার ওয়েবসাইটটি একটি লাইভ পাবলিক লিঙ্ক পেয়ে যাবে (যেমন: `https://royal-stepz-zone-qatar.vercel.app`), যা যে কেউ যেকোনো ডিভাইস থেকে দেখতে পারবে!

#### বিকল্প: GitHub Pages দিয়ে ডিপ্লয় করতে চাইলে:
প্রজেক্টে `npm run build` দিলে `dist` ফোল্ডারে সম্পূর্ণ প্রোডাকশন কোড তৈরি হয়, যা GitHub Actions বা GitHub Pages এর মাধ্যমে সরাসরি হোস্ট করা যায়।

---

## 📁 ফাইল ও ফোল্ডার ডিরেক্টরি পরিচিতি (Project Structure)

```
├── src/
│   ├── components/        # সব UI কম্পোনেন্ট (Header, Footer, Admin, ProductCard, etc.)
│   │   ├── AdminDashboard.tsx   # গোপন মাস্টার অ্যাডমিন ড্যাশবোর্ড ও এডিটর
│   │   ├── Header.tsx           # ক্যাশ অন ডেলিভারি, কার্ট, উইশলিস্ট ও সার্চ বার
│   │   ├── ProductCard.tsx      # জুতার প্রিমিয়াম কার্ড, সাইজ পিকার ও কুইক বাই
│   │   ├── CartDrawer.tsx       # শপিং ব্যাগ ও অর্ডার চেকআউট ড্রয়ার
│   │   ├── ProductDetailModal.tsx # সম্পূর্ণ প্রোডাক্ট ভিউ, সাইজ চার্ট ও ডেসক্রিপশন
│   │   └── ...
│   ├── context/
│   │   └── StoreContext.tsx     # কার্ট, উইশলিস্ট, পণ্য তালিকা, অর্ডার ও স্টেট ম্যানেজমেন্ট
│   ├── data/
│   │   └── products.ts          # কাতারের সকল প্রিমিয়াম স্নিকার্স ও জুতার ডিফল্ট ডেটা
│   ├── types.ts                 # TypeScript টাইপ ও ইন্টারফেস
│   ├── App.tsx                  # মূল অ্যাপ্লিকেশন লেআউট ও ফিল্টারিং
│   ├── main.tsx                 # রিঅ্যাক্ট রেন্ডারার
│   └── index.css                # Tailwind CSS v4 স্টাইলিং
├── package.json                 # প্রজেক্ট ডিপেন্ডেন্সি ও স্ক্রিপ্ট
├── vite.config.ts               # Vite কনফিগারেশন
└── README.md                    # এই নির্দেশিকা ফাইল
```

---

## 🛠️ বিল্ড স্ক্রিপ্ট (Available Scripts)

- `npm run dev` : লোকাল ডেভেলপমেন্ট সার্ভার শুরু করে (`port 3000`)
- `npm run build` : প্রোডাকশন রেডি বিল্ড তৈরি করে `dist/` ফোল্ডারে
- `npm run preview` : তৈরি করা প্রোডাকশন বিল্ড লোকালি প্রিভিউ করে
- `npm run lint` : টাইপস্ক্রিপ্ট কোড ভ্যালিডেশন চেক করে

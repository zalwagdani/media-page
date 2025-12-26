// Layout configurations for the media page
export const layouts = {
  'classic': {
    name: 'كلاسيكي',
    description: 'التصميم الكلاسيكي الأصلي - الصورة في الأعلى مع الاسم والروابط بالأسفل',
    icon: '📱',
    preview: '/previews/classic.png',
    features: {
      profilePosition: 'center',      // مركز الصفحة
      profileSize: 'large',            // حجم كبير للصورة
      socialIconsStyle: 'circular',    // أيقونات دائرية
      socialIconsLayout: 'grid',       // شبكة
      codesPosition: 'bottom',         // الأكواد في الأسفل
      codesStyle: 'cards',             // بطاقات
      youtubePosition: 'middle',       // الفيديو في المنتصف
      spacing: 'comfortable',          // مسافات مريحة
      animation: 'subtle'              // حركات خفيفة
    }
  },
  'modern': {
    name: 'عصري',
    description: 'تصميم عصري وأنيق - الصورة بجانب المعلومات، مع تخطيط أفقي للروابط',
    icon: '✨',
    preview: '/previews/modern.png',
    features: {
      profilePosition: 'split',        // منقسم: صورة على اليسار ومعلومات على اليمين
      profileSize: 'medium',           // حجم متوسط
      socialIconsStyle: 'rounded',     // أيقونات مستديرة الزوايا
      socialIconsLayout: 'horizontal', // صف أفقي
      codesPosition: 'side',           // الأكواد على الجانب
      codesStyle: 'compact',           // مضغوطة
      youtubePosition: 'featured',     // الفيديو مميز في الأعلى
      spacing: 'tight',                // مسافات ضيقة
      animation: 'smooth'              // حركات ناعمة
    }
  },
  'minimal': {
    name: 'بسيط',
    description: 'تصميم بسيط ونظيف - يركز على المحتوى بدون عناصر إضافية',
    icon: '⚡',
    preview: '/previews/minimal.png',
    features: {
      profilePosition: 'top',          // في الأعلى
      profileSize: 'small',            // حجم صغير
      socialIconsStyle: 'simple',      // أيقونات بسيطة
      socialIconsLayout: 'list',       // قائمة عمودية
      codesPosition: 'integrated',     // مدمجة مع المحتوى
      codesStyle: 'minimal',           // بسيطة جداً
      youtubePosition: 'inline',       // الفيديو ضمن المحتوى
      spacing: 'minimal',              // مسافات قليلة
      animation: 'none'                // بدون حركات
    }
  }
}

export const getLayout = (layoutKey) => {
  return layouts[layoutKey] || layouts['classic']
}

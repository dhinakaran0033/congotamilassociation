/* CTA local database (browser IndexedDB) shared by Tamil Charal and Events pages.
   Collections: books, announcements, events.
   Data lives in this browser only. Every page talks to it through CTADB.collection(name),
   so it can later be swapped for Firebase / a server API without touching the UI code. */
(function () {
  const DB_NAME = 'cta-charal'; // kept so books already added in this browser survive
  const VERSION = 2;
  const NAMES = ['books', 'announcements', 'events'];

  const SEEDS = {
    books: [
      { id: 'seed-ippasy-2026', createdAt: 2, title: 'ஆப்பிரிக்க தமிழச்சாரல் – ஐப்பசி இதழ் – 2026', description: 'Africa Tamil Charal – Aippasi (Ippasy) Issue – 2026',
        imageUrl: 'images/TS-2026-Ippasy_Page_01.jpg', pdfUrl: 'https://www.congotamilassociation.com/wp-content/uploads/2026/11/TS-2026-Ippasy-Nov.pdf' },
      { id: 'seed-purattasi-2026', createdAt: 1, title: 'ஆப்பிரிக்க தமிழச்சாரல் – புரட்டாசி இதழ் – 2026', description: 'Africa Tamil Charal – Purattasi Issue – 2026',
        imageUrl: 'images/ATC-26-Purattasi-TS_Page_01.jpg', pdfUrl: 'https://www.congotamilassociation.com/wp-content/uploads/2026/10/ATC-26-Purattasi-TS.pdf' }
    ],
    announcements: [
      { id: 'seed-ann-diwali', createdAt: 3, title: 'Diwali Celebration – Registration Open', titleTa: 'தீபாவளி கொண்டாட்டம் – பதிவு தொடங்கியது',
        description: 'Registration for the CTA Diwali cultural programme is now open. Please register before 20 October.',
        descriptionTa: 'CTA தீபாவளி கலை நிகழ்ச்சிக்கான பதிவு தொடங்கிவிட்டது. அக்டோபர் 20-க்குள் பதிவு செய்யவும்.' },
      { id: 'seed-ann-ganesh', createdAt: 2, title: 'Ganesh Chaturthi Celebration', titleTa: 'விநாயகர் சதுர்த்தி கொண்டாட்டம்', description: '' },
      { id: 'seed-ann-newyear', createdAt: 1, title: 'Tamil New Year 2026', titleTa: 'தமிழ்ப் புத்தாண்டு 2026', description: '' }
    ],
    events: [
      { id: 'seed-ev-newyear-2027', createdAt: 4, date: '2027-01-01', title: 'New Year Celebration 🎉', titleTa: 'புத்தாண்டு கொண்டாட்டம் 🎉',
        description: 'Ring in the New Year together with the CTA family.', descriptionTa: 'CTA குடும்பத்தினருடன் இணைந்து புத்தாண்டை வரவேற்போம்.',
        imageUrl: 'images/Happy-New-Year.jpeg' },
      { id: 'seed-ev-diwali-2026', createdAt: 3, date: '2026-11-08', title: 'Diwali Celebration 🎉', titleTa: 'தீபாவளி கொண்டாட்டம் 🎉',
        description: 'CTA Diwali cultural programme.', descriptionTa: 'CTA தீபாவளி கலை நிகழ்ச்சி.', imageUrl: 'images/CTA-Diwali.png' },
      { id: 'seed-ev-ganesh-2026', createdAt: 2, date: '2026-09-20', title: 'Ganesh Chaturthi Celebration', titleTa: 'விநாயகர் சதுர்த்தி கொண்டாட்டம்',
        description: 'A memorable celebration of Ganesh Chaturthi with cultural performances, community participation and Maha Prasad.',
        descriptionTa: 'கலை நிகழ்ச்சிகள், சமூகப் பங்கேற்பு, மகா பிரசாதத்துடன் மறக்க முடியாத விநாயகர் சதுர்த்தி கொண்டாட்டம்.',
        imageUrl: 'images/CTA-SOuthindia-community.jpeg', photosUrl: 'https://www.facebook.com/congohindumandal.kinshasa' },
      { id: 'seed-ev-tamilny-2026', createdAt: 1, date: '2026-04-14', title: 'Tamil New Year 2026', titleTa: 'தமிழ்ப் புத்தாண்டு 2026',
        description: 'A memorable celebration of Tamil New Year with cultural performances, community participation and Sports Prize Distribution.',
        descriptionTa: 'கலை நிகழ்ச்சிகள், சமூகப் பங்கேற்பு, விளையாட்டுப் போட்டி பரிசளிப்புடன் தமிழ்ப் புத்தாண்டு கொண்டாட்டம்.',
        imageUrl: 'images/CTA-Tamil-New-Year.jpg', photosUrl: 'https://www.facebook.com/media/set/?set=a.26550887897914404&type=3' }
    ]
  };

  const open = () => new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, VERSION);
    r.onupgradeneeded = () => NAMES.forEach(n => { if (!r.result.objectStoreNames.contains(n)) r.result.createObjectStore(n, { keyPath: 'id' }); });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });

  const run = async (name, mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction(name, mode), out = fn(tx.objectStore(name));
      tx.oncomplete = () => { db.close(); res(out && out.result); };
      tx.onerror = () => rej(tx.error);
    });
  };

  const collection = name => ({
    // Seed once per browser so deleted starter items stay deleted
    async list() {
      const flag = name === 'books' ? 'cta-charal-seeded' : 'cta-seeded-' + name; // books flag name predates this file
      if (!localStorage.getItem(flag)) {
        for (const item of SEEDS[name]) await run(name, 'readwrite', s => s.put(item));
        localStorage.setItem(flag, '1');
      }
      return run(name, 'readonly', s => s.getAll());
    },
    add: data => run(name, 'readwrite', s => s.put({ id: name[0] + Date.now() + Math.random().toString(36).slice(2, 6), createdAt: Date.now(), ...data })),
    remove: id => run(name, 'readwrite', s => s.delete(id))
  });

  window.CTADB = { collection };
})();

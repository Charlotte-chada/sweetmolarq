import Link from 'next/link'

/* ── Tool cards data ── */
const TOOLS = [
  {
    href: '/calculator',
    emoji: '🧮',
    iconBg: 'bg-orange-50',
    name: 'Recipe Cost Calculator',
    nameTh: 'คำนวณต้นทุน Recipe',
    desc: 'ใส่ส่วนผสม + ราคา → รู้ cost/portion, food cost % และราคาขายที่แนะนำตาม margin เป้าหมาย แบบ real-time',
    feats: [
      'คำนวณ food cost % อัตโนมัติ',
      'แนะนำราคาขายตาม margin เป้าหมาย',
      'รองรับ ingredients ไม่จำกัด',
      'จำแนกประเภท เบเกอรี่ / กาแฟ / เค้ก',
    ],
    border: 'hover:border-orange-300',
  },
  {
    href: '/menu',
    emoji: '📊',
    iconBg: 'bg-pink-50',
    name: 'Menu Profitability Analyzer',
    nameTh: 'วิเคราะห์ความสามารถทำกำไรเมนู',
    desc: 'วิเคราะห์ทุกเมนูจากกำไรและยอดขาย — รู้ทันทีว่าอันไหน Star, Dog, Plow Horse หรือ Puzzle',
    feats: [
      'จัดกลุ่มเมนูเป็น 4 แบบ: Star, Dog, Plow Horse, Puzzle',
      'แนะนำว่าควรตัดหรือ promote เมนูไหน',
      'เปรียบเทียบ margin vs. ยอดขาย',
      'วิเคราะห์ได้ไม่จำกัดเมนู',
    ],
    border: 'hover:border-pink-300',
  },
  {
    href: '/breakeven',
    emoji: '💰',
    iconBg: 'bg-amber-50',
    name: 'Break-Even Calculator',
    nameTh: 'คำนวณจุดคุ้มทุน',
    desc: 'ใส่ fixed cost + ราคาขายเฉลี่ย → รู้ว่าต้องขายกี่แก้ว/ชิ้นต่อวัน พร้อม scenario simulator',
    feats: [
      'คำนวณ break-even units/วัน/เดือน',
      'Scenario simulator ×0.7 ถึง ×1.5',
      'วิเคราะห์ fixed vs. variable cost',
      'แสดง revenue target ที่ต้องถึง',
    ],
    border: 'hover:border-amber-300',
  },
]

/* ── Why-cost-matters cards ── */
const WHY_CARDS = [
  {
    pill: '❌ ปัญหาที่ 1',
    pillColor: 'bg-red-400',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    title: 'ตั้งราคาด้วยความรู้สึก',
    sub: '"คิดว่าน่าจะกำไรอยู่นะ..."',
    items: [
      'ไม่รู้ food cost % ที่แท้จริง',
      'ตั้งราคาต่ำเกินไปโดยไม่รู้ตัว',
      'ขายดีแต่เงินไม่เหลือสักที',
      'ไม่มีข้อมูลพอจะปรับราคาได้มั่นใจ',
    ],
    arrow: 'text-orange-400',
  },
  {
    pill: '❌ ปัญหาที่ 2',
    pillColor: 'bg-red-400',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    title: 'ไม่รู้ว่าขายกี่ชิ้นถึงคุ้มทุน',
    sub: '"เปิดร้านมาหลายเดือนแต่ยังไม่คืนทุน"',
    items: [
      'ค่าเช่า เงินเดือน ค่าน้ำไฟ — คิดไม่ครบ',
      'ไม่รู้ break-even point จริงๆ',
      'ไม่มี scenario ถ้าขึ้นราคาหรือลดต้นทุน',
      'ตัดสินใจโดยไม่มีตัวเลขรองรับ',
    ],
    arrow: 'text-pink-400',
  },
  {
    pill: '✅ SweetMolarQ ช่วยได้',
    pillColor: 'bg-orange-400',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'เปลี่ยนความรู้สึกเป็นตัวเลข',
    sub: 'ใช้งานได้เลย ไม่ต้องติดตั้ง ฟรี 100%',
    items: [
      'คำนวณ food cost % ทุก recipe อัตโนมัติ',
      'รู้ชัดว่าต้องขายกี่แก้ว/ชิ้นต่อวัน',
      'วิเคราะห์ว่าเมนูไหนทำกำไรจริงๆ',
      'ตัดสินใจได้อย่างมั่นใจด้วย data',
    ],
    arrow: 'text-amber-500',
  },
]

/* ── Beliefs ── */
const BELIEFS = [
  { icon: '🧁', text: 'คนทำขนมและบาริสต้าทุกคนสมควรได้รู้ว่า งานที่รักนั้น ทำให้กำไรด้วย' },
  { icon: '📊', text: 'Data ไม่ใช่เรื่องของนักบัญชีอย่างเดียว — เจ้าของร้านเล็กๆ ก็ใช้ได้และควรใช้ด้วย' },
  { icon: '💡', text: 'เครื่องมือดีๆ ไม่ควรแพงหรือซับซ้อน — ใช้ง่าย เข้าใจง่าย และฟรีดีที่สุด' },
  { icon: '🎯', text: 'ตั้งราคาด้วยตัวเลขจริง ไม่ใช่ความรู้สึก — นั่นคือก้าวแรกของร้านที่ยั่งยืน' },
]

const FOOTER_EMOJI_RAIN = ['☕', '🧁', '🍪', '🥐', '🍫', '💖', '✨']

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <span className="text-lg font-extrabold text-ink tracking-tight">
          SweetMolar<span className="grad-text">Q</span>
        </span>
        <div className="flex gap-1.5 items-center">
          <a href="#why"     className="text-xs text-gray-500 px-3 py-1.5 rounded-full border border-transparent hover:bg-gray-100 transition-colors font-medium hidden sm:block">ทำไมต้องคิดต้นทุน?</a>
          <a href="#pricing" className="text-xs text-gray-500 px-3 py-1.5 rounded-full border border-transparent hover:bg-gray-100 transition-colors font-medium hidden sm:block">ราคา</a>
          <Link href="/calculator"
            className="text-xs font-bold text-white px-4 py-1.5 rounded-full grad-bg shadow-sm hover:opacity-90 transition-opacity">
            เริ่มฟรี →
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-white text-center px-6 py-24">
        {/* soft gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full opacity-[0.15]"
          style={{ background: '#C97B4B', filter: 'blur(90px)' }} />
        <div className="pointer-events-none absolute -bottom-20 -left-16 w-[380px] h-[380px] rounded-full opacity-[0.12]"
          style={{ background: '#E87D9E', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full grad-bg inline-block animate-pulse" />
            Data meets Cafe · Thailand 2026
          </div>

          {/* emoji row */}
          <div className="flex justify-center gap-1.5 text-2xl mb-5 flex-wrap">
            {['☕','🫘','🥐','🎂','🍪','🧁','🍫','🥛'].map((e, i) => (
              <span key={i} className="hover:scale-125 transition-transform cursor-default inline-block">{e}</span>
            ))}
          </div>

          <h1 className="text-5xl font-extrabold text-ink leading-[1.1] tracking-tight mb-4">
            เครื่องมือ<span className="grad-text">คำนวณ</span><br />
            ที่ Cafe &amp; Bakery<br />
            ต้องการ
          </h1>

          <p className="text-base text-gray-500 max-w-md mx-auto mb-8 leading-relaxed font-normal">
            ไม่รู้ว่าตั้งราคาเท่าไหร่? ขายกี่แก้วถึงจะคุ้มทุน?<br />
            SweetMolarQ ตอบด้วย <strong className="text-ink">ตัวเลขจริง</strong> — ไม่ใช่ความรู้สึก
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-10">
            <Link href="/calculator"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-7 py-3 rounded-full grad-bg shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all">
              🧮 เริ่มคำนวณเลย — ฟรี
            </Link>
            <a href="#why"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 px-7 py-3 rounded-full bg-white border-1.5 border-gray-200 hover:border-accent hover:text-accent-dk transition-colors">
              ทำไมต้องคิดต้นทุน?
            </a>
          </div>

          {/* stat strip */}
          <div className="flex justify-center max-w-xs mx-auto bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {[['3','เครื่องมือฟรี'],['฿0','เริ่มต้น'],['5 นาที','รู้ต้นทุนจริง'],['100%','ออนไลน์']].map(([n, l], i, arr) => (
              <div key={l} className={`flex-1 py-3.5 text-center ${i < arr.length-1 ? 'border-r border-gray-200' : ''}`}>
                <div className="text-lg font-extrabold grad-text leading-none">{n}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEARCH / QUICK NAV ═══ */}
      <div className="bg-white border-t border-b border-gray-200 px-6 py-5 text-center">
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">ฉันต้องการ...</p>
        <div className="flex items-center gap-2 bg-gray-50 border-[1.5px] border-gray-200 rounded-full px-4 py-2 max-w-[440px] mx-auto mb-3 hover:border-accent transition-colors cursor-text">
          <span className="text-gray-400">🔍</span>
          <span className="text-sm text-gray-400"><strong className="text-gray-700">คำนวณต้นทุนกาแฟ</strong>, วิเคราะห์เมนู, คำนวณ break-even...</span>
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          {[
            { href: '/calculator', label: '🧮 คำนวณต้นทุน' },
            { href: '/menu',       label: '📊 วิเคราะห์เมนู' },
            { href: '/breakeven',  label: '💰 Break-Even' },
            { href: '#why',        label: '💡 ทำไมต้องคิดต้นทุน?' },
            { href: '#story',      label: '📖 เรื่องราว' },
          ].map(t => (
            <a key={t.href} href={t.href}
              className="text-[11px] font-semibold text-gray-600 px-3.5 py-1.5 bg-white border border-gray-200 rounded-full hover:border-accent hover:text-accent-dk hover:-translate-y-0.5 transition-all">
              {t.label}
            </a>
          ))}
        </div>
      </div>

      {/* ═══ TOOLS ═══ */}
      <section id="tools" className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-2">🛠 Web Tools · ใช้งานฟรี 100%</p>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight mb-2">ทุก tool ที่<br />Cafe &amp; Bakery ต้องการ</h2>
        <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
          ออกแบบโดย Data Engineer ที่เข้าใจ pain point จริงๆ ของเจ้าของร้าน
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className={`group bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 flex flex-col gap-3.5 hover:-translate-y-1.5 hover:shadow-lg transition-all ${tool.border}`}>
              {/* top row */}
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 ${tool.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                  {tool.emoji}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 text-accent-dk">
                  ฟรีตลอดกาล
                </span>
              </div>
              {/* name */}
              <div>
                <div className="text-sm font-bold text-ink leading-tight">{tool.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{tool.nameTh}</div>
              </div>
              {/* desc */}
              <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
              {/* features */}
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5 mt-auto">
                {tool.feats.map(f => (
                  <div key={f} className="flex items-center gap-2 text-[11px] text-gray-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full grad-bg flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              {/* hover cta */}
              <div className="text-xs font-bold text-accent opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                ลองใช้งาน →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ WHY COST MATTERS ═══ */}
      <section id="why" className="bg-white border-t border-b border-gray-200 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-2">💡 ทำไมต้องคิดต้นทุน?</p>
          <h2 className="text-3xl font-extrabold text-ink tracking-tight mb-2">
            ถ้าไม่รู้ต้นทุน<br />ก็ไม่รู้ว่ากำไรหรือเปล่า
          </h2>
          <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
            ปัญหาที่เจ้าของร้าน Cafe &amp; Bakery เจอบ่อยที่สุด — และ SweetMolarQ ช่วยแก้ได้
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHY_CARDS.map(card => (
              <div key={card.title}
                className={`${card.bg} border-[1.5px] ${card.border} rounded-2xl p-5 hover:-translate-y-1 transition-transform`}>
                <span className={`inline-block text-[10px] font-bold text-white px-3 py-1 rounded-full mb-3 ${card.pillColor}`}>
                  {card.pill}
                </span>
                <div className="text-sm font-bold text-ink mb-1">{card.title}</div>
                <div className="text-[11px] text-gray-500 mb-3">{card.sub}</div>
                <ul className="flex flex-col gap-1.5">
                  {card.items.map(item => (
                    <li key={item} className="flex gap-2 text-[11px] text-gray-700 font-medium items-start leading-relaxed">
                      <span className={`${card.arrow} font-bold mt-0.5 flex-shrink-0`}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-1">📌 เสียงจากเพื่อนๆ</p>
            <h2 className="text-2xl font-extrabold text-ink tracking-tight">I like &amp; I wish</h2>
            <p className="text-sm text-gray-500 mt-1">ลองใช้งานแล้วเป็นยังไงบ้าง? บอกเราได้เลย ✨</p>
          </div>
          <a
            href="mailto:sweetmolarq@gmail.com?subject=I like / I wish — SweetMolarQ&body=ชื่อ: %0Aความเห็น: %0Aประเภท (I like / I wish): "
            className="inline-flex items-center gap-2 text-xs font-bold text-white px-4 py-2 rounded-full grad-bg shadow-sm hover:opacity-90 transition-opacity self-center">
            ✏️ เพิ่มความเห็นของคุณ
          </a>
        </div>

        {/* empty state */}
        <div className="border-[1.5px] border-dashed border-gray-200 rounded-2xl py-14 px-6 text-center bg-white">
          <div className="text-4xl mb-3 opacity-30">💬</div>
          <p className="text-sm font-bold text-gray-600 mb-1">ยังไม่มีความเห็นสักตัว</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed mb-5">
            เป็นคนแรกที่แชร์ประสบการณ์การใช้งาน SweetMolarQ — ทุกความเห็นมีค่ามากจริงๆ
          </p>
          <a
            href="mailto:sweetmolarq@gmail.com?subject=I like / I wish — SweetMolarQ&body=ชื่อ: %0Aความเห็น: %0Aประเภท (I like / I wish): "
            className="inline-flex items-center gap-2 text-xs font-bold text-white px-5 py-2.5 rounded-full grad-bg hover:opacity-90 transition-opacity">
            ✏️ แชร์ความเห็น
          </a>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="border-t border-b border-gray-200 px-6 py-16"
        style={{ background: 'linear-gradient(160deg, #FBF0E8 0%, #FFFFFF 45%, #FDF0F5 100%)' }}>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-2">💎 ราคา</p>
          <h2 className="text-3xl font-extrabold text-ink tracking-tight mb-2">ตอนนี้ใช้ฟรี<br />ได้เลยทุก tool</h2>
          <p className="text-sm text-gray-500 mb-8">ไม่ต้องสมัครสมาชิก · ไม่ต้องใส่บัตรเครดิต · ฟรีทุกคน</p>

          <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              🎉 ฟรีตลอดกาล · ไม่มีแผน Pro ในตอนนี้
            </div>
            <div className="text-6xl font-extrabold grad-text tracking-tight mb-1">฿0</div>
            <div className="text-xs text-gray-400 mb-6">ฟรีทุก feature ทุก tool ไม่จำกัด</div>

            <ul className="flex flex-col gap-2 mb-7 text-left max-w-xs mx-auto">
              {[
                '🧮 Recipe Cost Calculator — ไม่จำกัดจำนวน recipe',
                '📊 Menu Profitability Analyzer — วิเคราะห์ได้ทุกเมนู',
                '💰 Break-Even Calculator + Scenario Simulator',
                'คำนวณ real-time ไม่ต้องดาวน์โหลด ไม่ต้องติดตั้ง',
              ].map(f => (
                <li key={f} className="flex gap-2 text-xs text-gray-700 font-medium items-start leading-relaxed">
                  <span className="grad-text font-black mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/calculator"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-8 py-3 rounded-full grad-bg shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all">
              🧮 เริ่มใช้งานเลย — ฟรี
            </Link>
          </div>

          <div className="mt-4 px-5 py-3.5 bg-white border-[1.5px] border-dashed border-gray-200 rounded-xl text-xs text-gray-500 font-medium">
            🚀 <strong className="text-gray-700">อนาคต:</strong> กำลังพัฒนา features เพิ่มเติม เช่น บันทึก recipe ลง cloud, export รายงาน และอีกมากมาย — จะแจ้งให้ทราบเมื่อพร้อม
          </div>
        </div>
      </section>

      {/* ═══ STORY ═══ */}
      <section id="story" className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-2">📖 เรื่องราว</p>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight mb-6">ทำไมถึงสร้าง SweetMolarQ?</h2>

        {/* quote */}
        <div className="border-l-4 border-l-accent bg-gradient-to-r from-orange-50 to-pink-50 rounded-r-2xl px-6 py-5 mb-6">
          <p className="text-base text-ink leading-relaxed mb-2">
            "เคยทำขนมขาย เคยเป็นบาริสต้า — ตอนนั้นรู้สึกว่าการคิดต้นทุนมันยากมาก แต่พอลองทำจริงๆ มันช่วยได้จริง เพราะถ้าไม่คิดต้นทุน เราไม่มีทางรู้เลยว่าเรากำไรหรือเปล่า"
          </p>
          <cite className="text-xs text-gray-400 font-semibold not-italic">— เรื่องจริงของคนสร้าง SweetMolarQ</cite>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          ประสบการณ์จากการขายขนมและทำกาแฟทำให้รู้ว่า การทำงานกับตัวเลขต้นทุนไม่ใช่เรื่องง่าย — แต่มันจำเป็นมาก หลายคนเปิดร้านด้วยใจรัก แต่ไม่รู้ว่าแต่ละชิ้นที่ขายออกไปนั้น กำไรจริงหรือเปล่า
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          SweetMolarQ เลยเกิดขึ้น เพื่อเปลี่ยนความรู้สึก "น่าจะกำไรอยู่" ให้กลายเป็นตัวเลขที่จับต้องได้ — ด้วย tools ที่เข้าใจง่าย ใช้ได้ทันที และฟรี
        </p>

        {/* beliefs */}
        <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-5">
          <p className="text-[10px] font-bold tracking-widest uppercase grad-text mb-4">💛 สิ่งที่ SweetMolarQ เชื่อ</p>
          <div className="flex flex-col gap-3">
            {BELIEFS.map(b => (
              <div key={b.icon} className="flex gap-3 text-sm text-gray-700 items-start leading-relaxed">
                <span className="text-base flex-shrink-0">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BAND ═══ */}
      <section className="relative overflow-hidden bg-white border-t border-gray-200 px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[400px] rounded-full opacity-[0.08]"
            style={{ background: 'linear-gradient(135deg, #C97B4B, #E87D9E)', filter: 'blur(80px)' }} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-ink tracking-tight mb-3 leading-tight">
            พร้อมวัดธุรกิจ<br />
            <span className="grad-text">Cafe &amp; Bakery</span> ด้วย data?
          </h2>
          <p className="text-sm text-gray-500 mb-7">เริ่มใช้งานได้เลย ไม่ต้องสมัครสมาชิก ไม่ต้องใส่บัตรเครดิต</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/calculator"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-7 py-3 rounded-full grad-bg shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all">
              🧮 เริ่มคำนวณต้นทุน — ฟรี
            </Link>
            <Link href="/breakeven"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 px-7 py-3 rounded-full bg-white border border-gray-200 hover:border-accent hover:text-accent-dk transition-colors">
              💰 คำนวณจุดคุ้มทุน
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative overflow-hidden bg-white border-t border-gray-200 px-6 py-10 text-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {FOOTER_EMOJI_RAIN.map((emoji, i) => (
            <span
              key={`${emoji}-${i}`}
              className="emoji-fall absolute text-lg opacity-70"
              style={{
                left: `${8 + i * 13}%`,
                top: '-22px',
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${6.5 + (i % 3) * 1.2}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative z-10">
        <div className="text-xl font-extrabold text-ink tracking-tight mb-1">
          SweetMolar<span className="grad-text">Q</span>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          Sweet (ความหวาน) · Molar (โมเลกุล) · Q (Quantify) = วิทยาศาสตร์แห่งขนมที่วัดได้
        </p>

        <div className="flex gap-5 justify-center flex-wrap mb-5">
          {[
            { href: '/calculator', label: '🧮 Calculator' },
            { href: '/menu',       label: '📊 Menu Analyzer' },
            { href: '/breakeven',  label: '💰 Break-Even' },
            { href: '#why',        label: '💡 ทำไมต้องคิดต้นทุน?' },
            { href: '#story',      label: '📖 เรื่องราว' },
          ].map(l => (
            <a key={l.href} href={l.href} className="text-xs text-gray-400 hover:text-accent transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </div>

        {/* contact */}
        <div className="mb-5">
          <a href="mailto:sweetmolarq@gmail.com"
            className="inline-flex items-center gap-2 text-xs font-semibold text-accent-dk px-4 py-2 rounded-full bg-orange-50 border border-orange-200 hover:bg-accent hover:text-white hover:border-accent transition-all">
            ✉️ ติดต่อเรา · sweetmolarq@gmail.com
          </a>
        </div>

        <p className="text-[10px] text-gray-300">
          Data meets Cafe · Thailand · 2026 · Built with ❤️ by a Data Engineer who loves coffee
        </p>
        </div>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import Navbar from '@/components/Navbar'

const TOOLS = [
  {
    href: '/calculator',
    emoji: '🧮', bg: 'bg-amber-50', border: 'border-amber-100',
    title: 'Recipe Cost Calculator',
    badge: 'ฟรี', badgeClass: 'bg-green-50 border-green-200 text-green-700',
    desc: 'ใส่ส่วนผสม + ราคา → รู้ cost/ชิ้น, food cost % และราคาขายที่แนะนำทันที',
    tags: ['food cost %', 'markup calc', 'portion size'],
  },
  {
    href: '/menu',
    emoji: '📊', bg: 'bg-yellow-50', border: 'border-yellow-100',
    title: 'Menu Profitability Analyzer',
    badge: 'ฟรี', badgeClass: 'bg-green-50 border-green-200 text-green-700',
    desc: 'วิเคราะห์ทุกเมนูด้วย Menu Engineering Matrix — Star, Dog, Plow Horse, Puzzle',
    tags: ['BCG matrix', 'star/dog', 'menu strategy'],
  },
  {
    href: '/breakeven',
    emoji: '💰', bg: 'bg-green-50', border: 'border-green-100',
    title: 'Break-Even Calculator',
    badge: 'ฟรี', badgeClass: 'bg-green-50 border-green-200 text-green-700',
    desc: 'คำนวณว่าต้องขายกี่แก้ว/ชิ้นต่อวันถึงจะคุ้มต้นทุนทั้งหมด',
    tags: ['fixed cost', 'daily target', 'scenario sim'],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200
                        rounded-full px-4 py-1.5 text-xs text-pink-700 font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block"></span>
          Data meets Cafe — SweetMolarQ
        </div>

        <div className="text-4xl flex justify-center gap-1 flex-wrap mb-4">
          {Array.from('☕🫘🥐🎂🍪🧁🍫🥛🍰🫖').map((e, i) => (
            <span key={i} className="hover:scale-125 transition-transform cursor-default">{e}</span>
          ))}
        </div>

        <h1 className="font-display text-5xl font-semibold text-coffee leading-tight mb-3">
          <span className="text-pink-500">Sweet</span> Science<br />
          of{' '}<em className="text-amber-500 italic">Bakery &amp; Cafe</em>
        </h1>

        <div className="inline-block bg-amber-50 border border-amber-200 text-amber-700
                        text-xs rounded-lg px-4 py-2 mb-5">
          SweetMolar = โมเลกุลแห่งความหวาน · Q = Quantify วัดผลได้จริง
        </div>

        <p className="text-muted font-light text-base max-w-md mx-auto mb-8 leading-relaxed">
          เครื่องมือคำนวณต้นทุน วิเคราะห์เมนู และวางแผนการเงิน
          สำหรับ cafe และ home baker ที่อยากรู้จริงว่าธุรกิจตัวเองเป็นยังไง
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/calculator"
            className="bg-coffee text-white text-sm font-medium px-6 py-3 rounded-full
                       hover:bg-pink-500 hover:text-white transition-colors">
            เริ่มใช้งาน — ฟรี
          </Link>
          <a href="#tools"
            className="border border-cream-border text-coffee text-sm px-6 py-3 rounded-full
                       hover:border-caramel transition-colors">
            ดู tools ทั้งหมด
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-0 mt-10 border border-cream-border rounded-2xl
                        overflow-hidden bg-white max-w-sm mx-auto">
          {[['3', 'เครื่องมือ'], ['฿0', 'เริ่มฟรี'], ['5 นาที', 'รู้ต้นทุนจริง']]
            .map(([num, label], i, arr) => (
              <div key={label}
                className={`flex-1 py-4 text-center ${
                  i < arr.length - 1 ? 'border-r border-cream-border' : ''
                }`}>
                <div className="font-display text-2xl font-semibold text-coffee">{num}</div>
                <div className="text-[11px] text-muted mt-0.5">{label}</div>
              </div>
            ))}
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="max-w-2xl mx-auto px-6 pb-10">
        <p className="text-[11px] font-medium tracking-widest uppercase text-caramel mb-2">Tools</p>
        <h2 className="font-display text-3xl font-semibold text-coffee mb-2">ทุก tool ที่ Cafe &amp; Bakery ต้องการ</h2>
        <p className="text-sm text-muted font-light mb-6 leading-relaxed">
          ออกแบบโดย Data Engineer ที่เข้าใจว่า pain point จริงๆ ของเจ้าของร้านคืออะไร
        </p>
        <div className="flex flex-col gap-3">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-white border border-cream-border rounded-2xl p-5 flex gap-4
                         hover:border-caramel transition-colors group">
              <div className={`w-11 h-11 rounded-xl ${tool.bg} ${tool.border} border flex
                              items-center justify-center text-2xl shrink-0`}>
                {tool.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{tool.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tool.badgeClass}`}>
                    {tool.badge}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-2">{tool.desc}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {tool.tags.map(tag => (
                    <span key={tag}
                      className="text-[10px] text-muted bg-cream border border-cream-border
                                 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-2xl mx-auto px-6 pb-10">
        <p className="text-[11px] font-medium tracking-widest uppercase text-caramel mb-2">เรื่องราว</p>
        <h2 className="font-display text-3xl font-semibold text-coffee mb-4">ทำไมถึงชื่อ SweetMolarQ?</h2>
        <p className="text-sm text-muted font-light leading-relaxed mb-4">
          Molar มาจาก Chemistry — หน่วยวัดปริมาณโมเลกุล เหมือนกับที่เราวัดทุกอย่างในสูตรขนมด้วย data<br />
          Q ย่อจาก Quantify — เปลี่ยนความรู้สึก &ldquo;น่าจะกำไร&rdquo; ให้เป็นตัวเลขที่จับต้องได้
        </p>
        <blockquote className="border-l-[3px] border-pink-300 bg-white rounded-r-2xl px-5 py-4 mb-4">
          <p className="font-display text-xl italic text-coffee leading-snug mb-2">
            &ldquo;ฉันเทนมทิ้งกว่า 100 ลิตรกว่าจะทำลาเต้อาร์ทได้
            แต่ในฐานะ Data Engineer ฉันรู้ว่าต้องวัดอะไร&rdquo;
          </p>
          <span className="text-xs text-muted">— เรื่องจริงของคนสร้าง SweetMolarQ</span>
        </blockquote>
        <p className="text-sm text-muted font-light leading-relaxed">
          SweetMolarQ เกิดขึ้นเพราะเจ้าของ cafe หลายคนตั้งราคาด้วยความรู้สึก
          ไม่ใช่ตัวเลข — เราอยากเปลี่ยนสิ่งนั้น
        </p>
      </section>

      {/* PRICING */}
      <section className="max-w-2xl mx-auto px-6 pb-10">
        <p className="text-[11px] font-medium tracking-widest uppercase text-caramel mb-2">ราคา</p>
        <h2 className="font-display text-3xl font-semibold text-coffee mb-2">เริ่มฟรี ขยายได้เมื่อพร้อม</h2>
        <p className="text-sm text-muted font-light mb-6">ไม่ต้องใส่บัตรเครดิต ไม่มีการผูกสัญญา</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-5 border border-cream-border text-center">
            <p className="text-[13px] font-bold tracking-widest uppercase mb-1 text-pink-500">Free forever</p>
            <p className="font-display text-4xl font-semibold text-coffee mb-2">฿0 <span className="text-base font-body font-light text-muted">/เดือน</span></p>
            <p className="text-sm text-muted mb-4 leading-relaxed">สำหรับ home baker และร้านเพิ่งเริ่ม — ใช้ได้ฟรีทุกฟีเจอร์ ไม่มีค่าใช้จ่าย</p>
            <ul className="space-y-1.5 mb-2">
              <li className="flex gap-2 text-sm text-gray-800 justify-center"><span className="text-green-500 mt-0.5">✓</span>Recipe Cost Calculator</li>
              <li className="flex gap-2 text-sm text-gray-800 justify-center"><span className="text-green-500 mt-0.5">✓</span>Menu Analyzer (5 เมนู)</li>
              <li className="flex gap-2 text-sm text-gray-800 justify-center"><span className="text-green-500 mt-0.5">✓</span>Break-Even Calculator</li>
              <li className="flex gap-2 text-sm text-gray-800 justify-center"><span className="text-green-500 mt-0.5">✓</span>คำนวณ real-time</li>
            </ul>
            <div className="mt-4 text-xs text-pink-400">Pro version coming soon</div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-pink-50 border-y border-pink-100 py-12 px-6 text-center">
        <h2 className="font-display text-3xl font-semibold text-coffee mb-2">
          พร้อมวัดธุรกิจ cafe ของคุณด้วย data?
        </h2>
        <p className="text-sm text-muted font-light mb-6">เริ่มใช้งานได้เลย ไม่ต้องสมัครสมาชิก</p>
        <Link href="/calculator"
          className="inline-block bg-coffee text-white text-sm font-medium px-8 py-3.5
                     rounded-full hover:bg-pink-500 hover:text-white transition-colors">
          เริ่มคำนวณเลย — ฟรี
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-7 px-6 text-center border-t border-cream-border bg-white">
        <p className="font-display text-lg font-semibold text-coffee">
          SweetMolar<sup className="text-[10px] text-caramel font-body font-normal">Q</sup>
        </p>
        <p className="text-xs text-muted mt-1">Data meets Cafe · Thailand · 2026</p>
        <p className="text-[11px] text-pink-400 mt-1">
          Sweet (ความหวาน) + Molar (โมเลกุล) + Q (Quantify) = วิทยาศาสตร์แห่งขนมที่วัดได้
        </p>
      </footer>
    </div>
  )
}

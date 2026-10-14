import React, { useState } from 'react'
import {
  FiArrowUpRight,
  FiArrowRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiInstagram,
  FiMessageCircle
} from 'react-icons/fi'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [status, setStatus] = useState({
    type: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    setStatus({ type: '', message: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { name, email, subject, message } = formData

    if (
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      setStatus({
        type: 'error',
        message: 'Please complete all fields before submitting.'
      })
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      })
      return
    }

    setStatus({
      type: 'success',
      message:
        'Your form is valid! Connect a backend to deliver your message.'
    })

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  const contactMethods = [
    {
      number: '01',
      title: 'Drop an email',
      detail: 'juyelapondev@gmail.com',
      icon: FiMail
    },
    {
      number: '02',
      title: 'Give us a call',
      detail: '+880 1XXX-XXXXXX',
      icon: FiPhone
    },
    {
      number: '03',
      title: 'Find our base',
      detail: 'Dhaka, Bangladesh',
      icon: FiMapPin
    }
  ]

  return (
    <main className="overflow-hidden bg-[#F7F6FB] text-[#171321]">

      {/* HERO */}
      <section className="relative bg-[#171321] px-5 pb-16 pt-10 text-white sm:px-8 sm:pb-24 sm:pt-14 lg:px-12">

        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#A855F7]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#6D28D9]/20 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="flex items-center justify-between border-b border-white/15 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300 sm:text-sm">
              ShopHub / Contact
            </p>

            <span className="flex items-center gap-2 text-xs text-white/60 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Here to help
            </span>
          </div>

          <div className="grid items-end gap-10 pt-16 lg:grid-cols-[1.4fr_0.6fr] lg:pt-24">

            <div>
              <p className="mb-5 flex items-center gap-3 text-sm font-medium text-purple-300">
                <span className="h-px w-8 bg-purple-400" />
                HAVE SOMETHING ON YOUR MIND?
              </p>

              <h1 className="text-6xl font-black leading-[0.95] tracking-[-0.065em] sm:text-8xl lg:text-[112px]">
                LET'S
                <br />
                TALK
                <span className="text-[#A855F7]">.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                Questions, ideas, feedback — we're listening.
                Tell us what's on your mind and let's make
                your shopping experience better.
              </p>

              <a
                href="#contact-form"
                className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#A855F7] px-6 py-4 font-semibold text-white transition duration-300 hover:bg-[#9333EA]"
              >
                Start a conversation
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#171321] transition group-hover:rotate-45">
                  <FiArrowUpRight size={19} />
                </span>
              </a>
            </div>

            <div className="relative lg:pb-4 lg:pl-5">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#33204E] via-[#241936] to-[#171321] p-7 sm:p-9">

                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-purple-300/20" />
                <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full border border-purple-300/20" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/15 text-purple-300">
                    <FiMessageCircle size={27} />
                  </div>

                  <p className="mt-10 text-sm font-medium uppercase tracking-[0.2em] text-purple-300">
                    Your voice matters
                  </p>

                  <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                    Good things
                    <br />
                    start with a
                    <br />
                    <span className="text-purple-300">conversation.</span>
                  </h2>

                  <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6">
                    <div className="flex -space-x-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#33204E] bg-purple-300 text-xs font-bold text-[#171321]">
                        S
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#33204E] bg-pink-300 text-xs font-bold text-[#171321]">
                        H
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#33204E] bg-violet-200 text-xs font-bold text-[#171321]">
                        +
                      </span>
                    </div>

                    <p className="text-sm text-white/60">
                      The ShopHub support team
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-2 hidden -rotate-6 rounded-xl bg-[#E9D5FF] px-5 py-3 text-sm font-bold text-[#581C87] shadow-xl sm:block lg:-left-8">
                Say hello! ↗
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-700">
                Find your way
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Let's connect.
              </h2>
            </div>

            <p className="max-w-md leading-7 text-slate-500">
              Pick whichever works best for you. We're always happy
              to hear from the people who make ShopHub what it is.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {contactMethods.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.number}
                  className="group rounded-[1.75rem] border border-[#E8E2F0] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-900/5 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.2em] text-purple-600">
                      / {item.number}
                    </span>

                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1E8FF] text-xl text-purple-700 transition group-hover:bg-purple-600 group-hover:text-white">
                      <Icon />
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-bold">{item.title}</h3>

                  <p className="mt-2 break-words text-sm text-slate-500">
                    {item.detail}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-purple-700">
                    Get in touch
                    <FiArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* MESSAGE FORM */}
      <section
        id="contact-form"
        className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_100px_rgba(42,22,68,0.08)] lg:grid-cols-[0.8fr_1.2fr]">

          <div className="relative overflow-hidden bg-[#E9D5FF] p-7 sm:p-10 lg:p-12">
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-purple-400/30" />
            <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full border border-purple-400/30" />

            <div className="relative">
              <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-800">
                Your next step
              </span>

              <h2 className="mt-8 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                Got a
                <br />
                question?
                <br />
                <span className="text-purple-700">We're all ears.</span>
              </h2>

              <p className="mt-6 max-w-sm leading-7 text-purple-950/70">
                Leave us a message with a little context.
                We'll help you find the right direction.
              </p>

              <div className="mt-12 border-t border-purple-900/15 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-800/70">
                  A little reminder
                </p>

                <p className="mt-3 text-lg font-semibold text-purple-950">
                  Every great experience starts by listening.
                </p>
              </div>

              <div className="mt-12 flex items-center gap-3 text-sm font-semibold text-purple-900">
                <FiInstagram size={19} />
                <span>Stay connected with ShopHub</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
                Write to us
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Send a message<span className="text-purple-600">.</span>
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                Tell us a bit about what you need.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Your name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full border-b-2 border-slate-200 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full border-b-2 border-slate-200 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full border-b-2 border-slate-200 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-600"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Your message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full resize-y border-b-2 border-slate-200 bg-transparent px-1 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-purple-600"
                />
              </div>

              {status.message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl p-4 text-sm leading-6 ${
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-between rounded-full bg-[#171321] px-6 py-4 font-semibold text-white transition hover:bg-purple-700 sm:w-auto sm:min-w-56"
              >
                Send your message

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition group-hover:rotate-45">
                  <FiArrowUpRight size={20} />
                </span>
              </button>

              <p className="text-xs leading-5 text-slate-400">
                Demo form only. Messages will not be delivered until a backend
                service is connected.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CLOSING STRIP */}
      <section className="px-5 pb-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 rounded-3xl bg-[#171321] p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-sm font-medium text-purple-300">
              Made for better shopping
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Thanks for stopping by.
            </h2>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-3 self-start rounded-full bg-white px-5 py-3 font-semibold text-[#171321] transition hover:bg-purple-200 sm:self-auto"
          >
            Back to ShopHub
            <FiArrowRight />
          </a>
        </div>
      </section>

    </main>
  )
}

export default ContactUs

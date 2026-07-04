'use client'

import { useState } from 'react'
import { account, databases } from '@/lib/appwrite'
import { ID } from 'appwrite'
import { useRouter } from 'next/navigation'

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTION_ID = 'franchise_requests'

/* ---------------- STATE + CITY LIST ---------------- */

const statesAndCities = {
  Assam: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'],
  'Arunachal Pradesh': [
    'Itanagar',
    'Tawang',
    'Pasighat',
  ],
  Meghalaya: ['Shillong', 'Tura'],
  Nagaland: ['Kohima', 'Dimapur'],
  Manipur: ['Imphal'],
  Mizoram: ['Aizawl'],
  Tripura: ['Agartala'],
  'West Bengal': [
    'Kolkata',
    'Siliguri',
    'Durgapur',
  ],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur'],
  'Uttar Pradesh': [
    'Lucknow',
    'Kanpur',
    'Varanasi',
  ],
  Delhi: ['New Delhi'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  Karnataka: ['Bangalore', 'Mysore'],
  'Tamil Nadu': [
    'Chennai',
    'Coimbatore',
    'Madurai',
  ],
  Kerala: ['Kochi', 'Trivandrum'],
  Rajasthan: ['Jaipur', 'Udaipur', 'Jodhpur'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  Punjab: ['Ludhiana', 'Jalandhar', 'Bathinda'],
  Haryana: ['Chandigarh'],
  Himachal: ['Shimla'],
  Chhattisgarh: ['Raipur', 'Bhilai', 'Durg'],
  Odisha: ['Bhubaneswar', 'Cuttack'],
  Jharkhand: ['Ranchi', 'Jamshedpur'],
  Uttarakhand: ['Dehradun', 'Haridwar'],
  'jammu & kashmir': ['Srinagar', 'Jammu'],
  
}

/* ---------------- SAFE ATC GENERATOR ---------------- */

const getStateCode = (state) => {
  if (!state || typeof state !== 'string')
    return 'NA'

  return state.substring(0, 2).toUpperCase()
}

const generateATCCode = (state) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let code = ''

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(
      Math.floor(Math.random() * chars.length)
    )
  }

  return `${getStateCode(state)}-${code}`
}

export default function FranchiseSignup() {
  const router = useRouter()

  const fieldClass =
    'bnmi-font-body w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[#FBF9F4] placeholder-[#D5D8E3]/50 outline-none transition-all duration-300 [color-scheme:dark] hover:border-[#C9A24B]/35 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30'

  const optionClass = 'bg-[#0A1229] text-[#FBF9F4]'

  const [form, setForm] = useState({
    name: '',
    instituteName: '',
    email: '',
    password: '',
    designation: '',
    dob: '',
    address: '',
    pincode: '',
    amcCode: '',
    state: '',
    city: '',
    mobile: '',
  })

  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)

  const [customCity, setCustomCity] =
    useState('')

  /* ---------------- STATE CHANGE ---------------- */

  const handleStateChange = (state) => {
    setForm((prev) => ({
      ...prev,
      state,
      city: '',
    }))

    setCities(statesAndCities[state] || [])
  }

  /* ---------------- SIGNUP ---------------- */

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!form.state) {
      alert('Please select a state ❌')
      return
    }

    if (!form.city) {
      alert('Please select a city ❌')
      return
    }

    if (
      form.city === 'Other' &&
      !customCity
    ) {
      alert('Please enter your city ❌')
      return
    }

    setLoading(true)

    try {
      const atcCode = generateATCCode(
        form.state
      )

      /* CREATE AUTH USER */
      await account.create(
        ID.unique(),
        form.email,
        form.password,
        form.name
      )

      /* SAVE DATA */
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          ...form,

          city:
            form.city === 'Other'
              ? customCity
              : form.city,

          franchiseEmail: form.email,

          atcCode,

          wallet: '0.00',

          courierWallet: '0.00',

          status: 'pending',
        }
      )

      alert(
        'Signup successful! Wait for admin approval.'
      )

      router.push('/login/institute')
    } catch (error) {
      console.error(error)

      alert(
        error.message || 'Something went wrong'
      )
    }

    setLoading(false)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A1229] px-4 py-16 sm:px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .bnmi-font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }

        .bnmi-font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(#C9A24B_1px,transparent_1px)] bg-size-[70px_70px] opacity-[0.03]" />
      <div className="absolute -top-28 left-1/2 h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-[#C9A24B]/15 blur-[170px]" />
      <div className="absolute bottom-0 left-0 h-110 w-110 rounded-full bg-linear-to-r from-[#C9A24B]/20 to-transparent blur-[140px]" />
      <div className="absolute right-0 top-1/3 h-120 w-120 rounded-full bg-linear-to-l from-[#C9A24B]/15 to-transparent blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="bnmi-font-body mb-5 inline-flex items-center rounded-full border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24B]">
            Franchise Application
          </div>

          <h1 className="bnmi-font-display text-4xl font-black leading-tight text-[#FBF9F4] sm:text-6xl">
            Start Your Premium Institute
          </h1>

          <p className="bnmi-font-body mx-auto mt-5 max-w-2xl text-base leading-8 text-[#D5D8E3] sm:text-lg">
            Fill in your details to apply for a BNMI franchise and wait for admin approval.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(201,162,75,0.10)] backdrop-blur-2xl transition-all duration-300 hover:border-[#C9A24B]/30 sm:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-[#C9A24B]/10 opacity-70" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C9A24B]/10 blur-[100px] transition duration-500 group-hover:bg-[#C9A24B]/15" />

          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              placeholder="Institute Name"
              className={fieldClass}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  instituteName:
                    e.target.value.toUpperCase(),
                })
              }
              required
            />

            <input
              placeholder="Owner's Name"
              className={fieldClass}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target.value.toUpperCase(),
                })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              className={fieldClass}
              style={{
                textTransform: 'lowercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value.toLowerCase(),
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              className={fieldClass}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />

            <input
              placeholder="Mobile"
              className={fieldClass}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  mobile:
                    e.target.value.toUpperCase(),
                })
              }
            />

            <input
              placeholder="AMC Code"
              className={fieldClass}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  amcCode:
                    e.target.value.toUpperCase(),
                })
              }
            />

            <select
              className={fieldClass}
              value={form.designation}
              onChange={(e) =>
                setForm({
                  ...form,
                  designation: e.target.value,
                })
              }
            >
              <option value="" className={optionClass}>
                Select Designation
              </option>

              <option value="DIRECTOR" className={optionClass}>Director</option>
              <option value="EMPLOYEE" className={optionClass}>Employee</option>
              <option value="PARTNER" className={optionClass}>Partner</option>
              <option value="PROPRIETOR" className={optionClass}>Proprietor</option>
              <option value="TRUSTEE" className={optionClass}>Trustee</option>
              <option value="OTHER" className={optionClass}>Other</option>
            </select>

            <input
              type="date"
              className={fieldClass}
              onChange={(e) =>
                setForm({
                  ...form,
                  dob: e.target.value,
                })
              }
            />

            <input
              placeholder="Address"
              className={`${fieldClass} md:col-span-2`}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  address:
                    e.target.value.toUpperCase(),
                })
              }
            />

            <input
              placeholder="Pincode"
              className={fieldClass}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  pincode:
                    e.target.value.toUpperCase(),
                })
              }
            />

            <select
              value={form.state}
              className={fieldClass}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                handleStateChange(
                  e.target.value
                )
              }
            >
              <option value="" className={optionClass}>
                Select State
              </option>

              {Object.keys(
                statesAndCities
              ).map((state) => (
                <option
                  key={state}
                  value={state}
                  className={optionClass}
                >
                  {state}
                </option>
              ))}
            </select>

            <select
              value={form.city}
              className={fieldClass}
              style={{
                textTransform: 'uppercase',
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            >
              <option value="" className={optionClass}>
                Select City
              </option>

              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                  className={optionClass}
                >
                  {city}
                </option>
              ))}

              <option value="Other" className={optionClass}>
                Other
              </option>
            </select>

            {form.city === 'Other' && (
              <input
                placeholder="Enter your city"
                className={`${fieldClass} md:col-span-2`}
                style={{
                  textTransform: 'uppercase',
                }}
                value={customCity}
                onChange={(e) =>
                  setCustomCity(
                    e.target.value.toUpperCase()
                  )
                }
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bnmi-font-body relative mt-8 w-full rounded-2xl py-4 font-bold uppercase tracking-[0.18em] text-[#0A1229] shadow-[0_14px_40px_rgba(201,162,75,0.25)] transition-all duration-300 ${
              loading
                ? 'cursor-not-allowed bg-[#C9A24B]/50'
                : 'bg-[#C9A24B] hover:-translate-y-1 hover:bg-[#d4b05a] hover:shadow-[0_20px_55px_rgba(201,162,75,0.35)]'
            }`}
          >
            {loading
              ? 'Creating...'
              : 'Create Account'}
          </button>
        </form>
      </div>
    </section>
  )
}
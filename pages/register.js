"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import axios from "axios"
import { Eye, EyeOff, ChevronRight, ChevronLeft } from "lucide-react"
import AuthLayout from "../components/AuthLayout"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "siswa", // Default role: siswa
    no_telp: "",
    tanggal_lahir: "",
    alamat: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateStep1 = () => {
    const errors = {}

    if (!formData.username.trim()) {
      errors.username = "Nama tidak boleh kosong"
    }

    if (!formData.email.trim()) {
      errors.email = "Email tidak boleh kosong"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid"
    }

    if (!formData.password) {
      errors.password = "Password tidak boleh kosong"
    } else if (formData.password.length < 8) {
      errors.password = "Password minimal 8 karakter"
    }

    if (formData.password !== formData.password2) {
      errors.password2 = "Konfirmasi password tidak sama"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    if (formData.role !== "siswa") return true

    const errors = {}

    if (!formData.no_telp.trim()) {
      errors.no_telp = "Nomor telepon tidak boleh kosong"
    }

    if (!formData.tanggal_lahir) {
      errors.tanggal_lahir = "Tanggal lahir tidak boleh kosong"
    }

    if (!formData.alamat.trim()) {
      errors.alamat = "Alamat tidak boleh kosong"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep2()) {
      return
    }

    setLoading(true)
    setError("")

    const dataToSend = { ...formData }

    // Jika role adalah 'admin', pastikan field tambahan diisi dengan nilai kosong
    if (dataToSend.role === "admin") {
      delete dataToSend.no_telp
      delete dataToSend.tanggal_lahir
      delete dataToSend.alamat
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, dataToSend)

      // Simpan token ke localStorage
      localStorage.setItem("accessToken", response.data.access)
      localStorage.setItem("refreshToken", response.data.refresh)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // Arahkan ke halaman sesuai role
      if (response.data.user.role === "admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/siswa-dashboard")
      }
    } catch (err) {
      console.error("Registration failed:", err)
      setError(
        err.response?.data?.detail ||
          Object.values(err.response?.data || {})
            .flat()
            .join(", ") ||
          "Terjadi kesalahan saat registrasi.",
      )
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const prevStep = () => {
    setStep(1)
  }

  return (
    <AuthLayout
      title="Daftar Akun Baru"
      subtitle={
        <>
          Atau{" "}
          <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
            masuk jika sudah punya akun
          </Link>
        </>
      }
    >
      <Head>
        <title>Registrasi - BimbelKu</title>
      </Head>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
          <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm">{error}</div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700"} mr-2`}
          >
            1
          </div>
          <div className="h-1 flex-1 bg-slate-200">
            <div
              className={`h-full ${step === 2 ? "bg-purple-600" : "bg-slate-200"}`}
              style={{ width: step === 1 ? "0%" : "100%" }}
            ></div>
          </div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700"} ml-2`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>Informasi Akun</span>
          <span>Data Pribadi</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                Daftar Sebagai
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  <option value="siswa">Siswa</option>
                  <option value="admin">Admin Bimbel</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.username ? "border-red-300" : "border-slate-300"}`}
                />
                {formErrors.username && <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.email ? "border-red-300" : "border-slate-300"}`}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.password ? "border-red-300" : "border-slate-300"}`}
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
                {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password2" className="block text-sm font-medium text-slate-700">
                Konfirmasi Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password2"
                  name="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password2}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.password2 ? "border-red-300" : "border-slate-300"}`}
                  placeholder="Masukkan password yang sama"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                </button>
                {formErrors.password2 && <p className="mt-1 text-sm text-red-600">{formErrors.password2}</p>}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={nextStep}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 group"
              >
                Lanjutkan
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {formData.role === "siswa" ? (
              <>
                <div className="space-y-1">
                  <label htmlFor="no_telp" className="block text-sm font-medium text-slate-700">
                    Nomor Telepon
                  </label>
                  <div className="mt-1">
                    <input
                      id="no_telp"
                      name="no_telp"
                      type="text"
                      required
                      value={formData.no_telp}
                      onChange={handleChange}
                      placeholder="Contoh: 08123456789"
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.no_telp ? "border-red-300" : "border-slate-300"}`}
                    />
                    {formErrors.no_telp && <p className="mt-1 text-sm text-red-600">{formErrors.no_telp}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-slate-700">
                    Tanggal Lahir
                  </label>
                  <div className="mt-1">
                    <input
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      type="date"
                      required
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.tanggal_lahir ? "border-red-300" : "border-slate-300"}`}
                    />
                    {formErrors.tanggal_lahir && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.tanggal_lahir}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="alamat" className="block text-sm font-medium text-slate-700">
                    Alamat
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="alamat"
                      name="alamat"
                      rows={3}
                      required
                      value={formData.alamat}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap"
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${formErrors.alamat ? "border-red-300" : "border-slate-300"}`}
                    ></textarea>
                    {formErrors.alamat && <p className="mt-1 text-sm text-red-600">{formErrors.alamat}</p>}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-4 text-center text-slate-600">
                <p>Tidak ada informasi tambahan yang diperlukan untuk Admin Bimbel.</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Kembali
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mendaftar...
                  </>
                ) : (
                  "Daftar"
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </AuthLayout>
  )
}


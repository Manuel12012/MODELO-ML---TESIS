import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  LockKeyhole,
  User,
  ShieldCheck,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // =====================================================
    // AUTENTICACIÓN TEMPORAL
    // =====================================================

    if (
      username.trim() === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem("authenticated", "true");

      navigate("/dashboard", {
        replace: true,
      });

      return;
    }

    setTimeout(() => {
      setLoading(false);
      setError("Las credenciales ingresadas no son correctas.");
    }, 400);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f7] px-5 py-10">

      {/* =====================================================
          FONDO DECORATIVO
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

      </div>


      {/* =====================================================
          CONTENEDOR
      ====================================================== */}

      <div className="relative z-10 w-full max-w-[420px]">


        {/* ===================================================
            LOGO
        ==================================================== */}

        <div className="mb-8 flex flex-col items-center text-center">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[17px] bg-slate-900 text-white shadow-xl shadow-slate-900/10">
            <Activity
              size={27}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-950">
            PredictSoft
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sistema predictivo de proyectos de software
          </p>

        </div>


        {/* ===================================================
            LOGIN CARD
        ==================================================== */}

        <div className="rounded-[28px] border border-white/80 bg-white/90 p-7 shadow-[0_25px_70px_-20px_rgba(15,23,42,0.20)] backdrop-blur-xl sm:p-9">


          {/* Encabezado */}

          <div className="mb-7">

            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Iniciar sesión
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-slate-500">
              Accede al panel de análisis predictivo.
            </p>

          </div>


          {/* =================================================
              FORMULARIO
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Usuario */}

            <div>

              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Usuario
              </label>

              <div className="relative">

                <User
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>


            {/* Contraseña */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Contraseña
                </label>

              </div>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>


            {/* Error */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <p className="text-sm leading-5 text-red-700">
                  {error}
                </p>

              </div>
            )}


            {/* =================================================
                BOTÓN
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition-all duration-200 hover:bg-blue-600 hover:shadow-blue-600/20 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verificando...
                </>
              ) : (
                <>
                  Iniciar sesión

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </>
              )}

            </button>

          </form>


          {/* =================================================
              SEGURIDAD
          ================================================== */}

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">

            <ShieldCheck
              size={15}
              className="text-emerald-500"
            />

            <span className="text-xs text-slate-400">
              Acceso protegido al sistema predictivo
            </span>

          </div>

        </div>


        {/* ===================================================
            FOOTER
        ==================================================== */}

        <p className="mt-6 text-center text-xs text-slate-400">
          PredictSoft · Plataforma de análisis de proyectos
        </p>

      </div>

    </main>
  );
}

export default Login;

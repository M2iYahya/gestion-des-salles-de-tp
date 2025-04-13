"use client"
import Image from "./components/image";
import { getRoleFromToken } from "./utils/getRole";
import React, { useState,useEffect } from "react";
import { isValidString } from "./utils/validateString";


function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const role = getRoleFromToken();
  useEffect(() => {
    // Check for the presence of the authToken in cookies
    if (isValidString(role)) {
      setIsAuthenticated(true);
    } else {
      // If token exists, assume authenticated
      setIsAuthenticated(false);
    }
  }, []);

  // While authentication check is in progress, don't render anything
  if (isAuthenticated === null) {
    return null; // You can show a loading spinner here if you'd like
  }
  // If not authenticated, return null or a redirect page
  if (isAuthenticated) {
    switch (role){
      case "UTILISATEUR" :
        return window.location.href = "/home";
      default :
        return window.location.href = "/admin";
    }
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (res.ok) {
        switch (role){
          case "UTILISATEUR" :
            return window.location.href = "/home";
          default :
            return window.location.href = "/admin";
        }
      } else {
        setResponse("Error: Invalid email or password");
      }
    } catch (error) {
      if (error instanceof Error) {
        // TypeScript now knows 'error' is of type 'Error'
        setResponse(`Error dyal catch: ${error.message}`);
      } else {
        // Fallback for unexpected types
        setResponse("An unknown error occurred");
      }
    }
  };

  return (
      <div className="w-full flex">
        <div className="w-1/2 relative bg-[url('/assets/login.jpeg')] bg-cover bg-no-repeat bg-center bg-origin-border h-screen hidden bg-black rounded-tr-[24px] rounded-br-[24px] md:flex flex-col justify-between">
          <div className="p-4">
            <h1 className="text-xl relative w-fit h-fit after:w-[60%] after:absolute after:left-[110%] after:top-[55%] after:translate-y-1/2 after:h-[2px] after:bg-white font-bold text-white">
              votre confort est notre priorité
            </h1>
          </div>
          <div className="w-full h-auto flex justify-between items-end p-4">
            <h1 className="text-4xl font-bold text-white leading-relaxed">
              <span className="text-7xl">Gérez</span> <br /> et Réservez Facilement <br /> Matériels et Salles de TP Physique
            </h1>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-screen">
          <div className="w-full h-[90%] flex items-center justify-center">
            <div className="w-full md:max-w-xl bg-white px-2 py-8">
              <div className="mb-8 flex justify-center items-center gap-2 flex-col">
                <Image src={"/assets/logo-fso.svg"} fallbackSrc={""} className="my-5"  alt="logo fso"/>
                <h1 className="text-3xl font-bold text-gray-800">
                  Bienvenue à nouveau
                </h1>
                <h2 className="text-sm font-bold text-gray-800">
                  Entrer votre addresse e-mail et votre mot de passe pour accéder
                  à votre compte
                </h2>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit} method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="votreNom@gmail.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Entrez votre mot de passe"
                  />
                </div>

                {response && 
                  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Erreur : </strong>
                    <span id="errorText" className="block sm:inline">Email ou mot de passe incorrect.</span>
                  </div>           
                }

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;


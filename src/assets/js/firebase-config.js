/* ============================================================
   FIREBASE — CONFIGS DA JÉSSICA (dois projetos separados)
   ------------------------------------------------------------
   neuro   → projeto "Dashboard Jessica"     (Neuropsicologia)
   clinica → projeto "Dashboard Psicoterapia" (Clínica/Psicoterapia)

   Cada formulário grava no seu próprio projeto, escolhido pelo
   atributo data-fb do <form>. Config web é público (segurança
   fica nas Regras do Firestore de cada projeto).

   👉 AMANHÃ: preencha o bloco "clinica" abaixo com o config do
      projeto "Dashboard Psicoterapia".
      (Console desse projeto → Configurações → Seus apps → app Web
       → Configuração do SDK → Config → copie o objeto.)
   Enquanto estiver "COLE_AQUI", a clínica funciona só via WhatsApp.
   ============================================================ */
window.FIREBASE_CONFIGS = {

  /* Neuropsicologia — projeto Dashboard Jessica (já ativo) */
  neuro: {
    apiKey: "AIzaSyBWWyuISV_FHb9YvzTq8fSYGylCg5X8rz8",
    authDomain: "dashboard-jessica.firebaseapp.com",
    projectId: "dashboard-jessica",
    storageBucket: "dashboard-jessica.firebasestorage.app",
    messagingSenderId: "386793328816",
    appId: "1:386793328816:web:c243407b688e3b4ddb2b75",
    measurementId: "G-NT1BGG5GSH"
  },

  /* Clínica/Psicoterapia — projeto Dashboard Psicoterapia (preencher) */
  clinica: {
    apiKey: "COLE_AQUI",
    authDomain: "COLE_AQUI.firebaseapp.com",
    projectId: "COLE_AQUI",
    storageBucket: "COLE_AQUI.firebasestorage.app",
    messagingSenderId: "COLE_AQUI",
    appId: "COLE_AQUI"
  }
};

// types/auth.d.ts
import '#auth-utils';

declare module '#auth-utils' {
  interface User {
    id: string;   // O il tipo corretto
    name: string; // Il campo che ti serve
    mail: string; // O il tipo corretto
    // ...eventuali altri campi che hai nel tuo oggetto user
  }
}
export {};
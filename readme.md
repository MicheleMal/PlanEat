# PlanEat
Applicazione per la gestone di **utenti, ricette, ingredienti e pianificazione pasti giornaliera**.
Questo progetto permettere agli utenti di creare le proprie ricette personalizzate, pianificare i pasti su base settimanale e generare la lista della spesa (prossimamente). 

---

## Funzionalità principali
- **Gestione utenti**
    - Registrazione e autenticazione (JWT)
    - Gestione profilo utente

- **Gestione ricette**
    - Creazione, modifica ed eliminazione di ricette personali
    - Associazione ingredienti con quantità e unità

- **Gestione ingredienti**
    - Catalogo globale ingredienti riutilizzabili
    - Ricerca ingredienti con **autocomplete**

- **Pianificazione pasti**
    - Creazione di pasti giornalieri collegati alle ricette
    - Supporto a diversi tipi di pasto (colazione, pranzo, cena, merenda, aperitivo)
    - Recupero pasti per range di date

- **Lista della spesa**
    - Generazione automatica lista ingredienti in base ai pasti pianificati per un range di date (startDate, endDate)

---

## Tecnologia
- NestJS
- TypeORM
- MySQL

## Documentazione
In locale localhost:3000/api 
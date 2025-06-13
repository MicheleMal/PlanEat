# Plan Eat

## Funzionamento
1. **Registrazione / Login**
    - L'utente si registra (`/auth/signup`) -> viene salvato con email, password Hash, name
    - Login -> riceve un JWT token per autenticarsi
    - Tutte el funzioni successive sono sollegate al suo userId

2. **Creazione Ricette**
    - L'utente crea una ricetta con:
        - titolo, descrizione, tempo, tags
        - elenco di ingredienti (nome, quantità, unità)
    - Ricetta salvata nella tabella Recipe, ingredienti nella Ingredient, tutti legati al userId
    Esempio: "Pasra al pomodoro" con 100g pasta, 2 pomodori, olio

3. **Pianificazione dei Pasti**
    - L'utnete può associare una ricetta a un giorno specifico e un tipo pasto (colazione, pranzo, cena, merenda)
    - Salvi tutto nella tabella Meal:
        - userId, recipeId, date, mealType
    Esempio: Lunedì 17, a pranzo -> "Pasta al pomodoro"

4. **Generazione Lista della Spesa**
    - L'utente fa una richiesta a `/shopping-list?weekStart=2025-06-10`
    - Il backend:
        - Legge tutti i pasti di quella settimana
        - Somma gli ingredienti delle ricette pianificate
        - Restituisce la lista aggregata (ingredienti + quantità totale)
    Esempio output:
    ```json
    [
        { name: "Pasta", quantity: 500, unit: "g" },
        { name: "Pomodoro", quantity: 6, unit: "pz" },
        ...
    ]
    ```
5. **Opzionale Spunta degli ingredienti acquistati**
    - Se implementi la persistenza, puoi salvare questa lista e permettere di:
        - spuntate un ingrediente (isChecked)
        - modificarla
        - tenerla fissa anche se cambi i pasti
6. **Facoltativo Gestione Dispensa (Pantry)**
    - L'utnete può aggiungere ingredienti che ha già in casa
    - Quando generi la lista spesa, puoi **escludere ciò che ha già nella dispensa**
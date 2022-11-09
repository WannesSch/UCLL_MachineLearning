# UCLL_MachineLearning
Use 'npm start' to start project

Use 'Client/public/JavaScript/Data/Config.js' to change params\n
Important: 
    - Using points and boat trails will slow down the application -> use a fleetcount of < 5
    - islandCounts over 30 will work but wont add extra islands
    - Network is 'optimized' to current settings, updating will effect the effectiveness.
    - Enable / Disable network by switching 'Global.network.useNetwork' (true/false). 
        When disabled, use arrow keys to drive the boat manually.
    - useMutation (enable in config), when enabled every gen will mutate. Every 10 seconds the program will calculate the best generation based on time alive & distance traveled, if the previousbestbrain is the same as the new calculated bestbrain it will update the server and reload the page. If boats gets stuck it will also refresh after 10 seconds. Reloading manually will also get the boats unstuck

UCLL project by: - Wannes Schillebeeckx - Brecht Saelens (test) - Sam Geboers - Sander Raymakers - Yago Engels
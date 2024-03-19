import { IncomingMessage, ServerResponse } from "http";
import { Pokemon, database } from "./model";
import { renderTemplate } from "./view";

export const getHome = async (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(await renderTemplate("src/views/HomeView.hbs"));
};

export const getNewForm = async (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200; 
    res.setHeader("Content-Type", "text/html");
    res.end(await renderTemplate("src/views/NewFormView.hbs"));
}

// TODO: Copy-paste the getOnePokemon and getAllPokemon functions from the previous exercise.

export const createPokemon = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    const body = await parseBody(req);
    const newPokemon = Object.fromEntries(new URLSearchParams(body).entries());
  
    database.push({
      id: database.length + 1,
      name: newPokemon.name,
      type: newPokemon.type
    });

    res.statusCode = 303;
    res.setHeader("Location", "/pokemon");
    res.end();
    //res.statusCode = 200;
    //res.setHeader("Content-Type", "text/html");
    //res.end(await renderTemplate("src/views/ListView.hbs", {pokemon: database}));
    //res.end(body);
};

export const getAllPokemon = async (req: IncomingMessage, res: ServerResponse) => {
    if(req.method === "GET" && req.url === "/pokemon")
    {
        res.statusCode = 200
        let message = "Pokemon retrieved successfully"
        let payload = database //data we want to send back to client. in this case, we are sending back partyDB 

        //the object that we are passing is in javascript and we need to pass a string because HTTP takes strings 
        //null: specifications (none for us)
        //2: number of spaces
        res.setHeader("Content-Type", "text/html")
        res.end(await renderTemplate("src/views/ListView.hbs", { pokemon: database}));
        //res.end(JSON.stringify({message, payload}, null, 2))
    }
    
}

export const getOnePokemon = (req: IncomingMessage, res: ServerResponse) => {
    if(req.method === "GET" && req.url?.startsWith("/pokemon/"))
    {
        //ex: GET /pokemon/1
        const urlParts = req.url.split("/")
        const pokemonId = parseInt(urlParts[2])
        const findPokemon = database.find((pokemon) => pokemon.id === pokemonId)

        if(findPokemon)
        {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify({message: "Pokemon was found!", payload: findPokemon}))
            
        }
    }
    
}

const parseBody = async (req: IncomingMessage) => {
    return new Promise<string>((resolve) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            resolve(body);
        });
    });
};

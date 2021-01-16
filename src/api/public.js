import { Router } from "express"
import path from "path"

export default ({ config, db }) => {
    let router = Router();

	// perhaps expose some API metadata at the root
	router.get('/', function (req, res) {
        res.sendFile(path.resolve('./src/public/index.html'))
    });

	return router;
}
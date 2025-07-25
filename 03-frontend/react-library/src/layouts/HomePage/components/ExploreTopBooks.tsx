import { Link } from "react-router-dom";
import { classicNameResolver } from "typescript"

export const ExploreTopBooks = ()=>{
    return(
        <div className="p-5 mb-4 bg-dark header">
            <div className="container-fluid py-5 text-white
            d-flex justify-content-center align-items-center flex-column">
                <div>
                <h1 className="display-5 fw-bold text-white">Find your next adventure</h1>
                <p className="col-md-8 fs-4 text-white">Where would you like to go next?</p>
                <Link className="btn btn-outline-light btn-lg" 
                type="button" to="/search">Explore Now</Link>
                </div>
            </div>
        </div>
    );
}
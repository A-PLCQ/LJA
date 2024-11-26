import React, { useEffect, useState } from 'react';
import { getPrinterById } from '../../services/printerService';
import axios from 'axios';
import '../../styles/FeaturedProducts.css';

const FeaturedProducts = ({ ids }) => {
    const [featuredPrinters, setFeaturedPrinters] = useState([]);

    useEffect(() => {
        const fetchFeaturedPrinters = async () => {
            try {
                const printersData = await Promise.all(
                    ids.map(async (id) => {
                        try {
                            const printer = await getPrinterById(id);

                            // Fetch printer images
                            const imagesResponse = await axios.get(
                                `http://localhost:5005/images/printer/${encodeURIComponent(printer.brand)}/${encodeURIComponent(
                                    printer.model
                                )}`
                            );

                            return {
                                ...printer,
                                images: imagesResponse.data.images,
                            };
                        } catch (error) {
                            console.error(`Erreur lors de la récupération de l'imprimante avec l'ID ${id}:`, error);
                            return null;
                        }
                    })
                );

                setFeaturedPrinters(printersData.filter((printer) => printer !== null));
            } catch (error) {
                console.error('Erreur lors de la récupération des imprimantes en vedette:', error);
            }
        };

        fetchFeaturedPrinters();
    }, [ids]);

    return (
        <div className="featured-products">
            <h2>Imprimantes en Vedette</h2>
            <div className="featured-products-container">
                {featuredPrinters.map((printer) => {
                    const imageUrl =
                        printer.images && printer.images.length > 0
                            ? `http://localhost:5005${printer.images[0]}`
                            : '/uploads/default-image.jpg';

                    return (
                        <div key={printer.id_printer} className="featured-product-card">
                            <div className="featured-product-image-wrapper">
                                <img src={imageUrl} alt={`${printer.brand} ${printer.model}`} className="featured-product-image" />
                            </div>
                            <h3>{printer.brand} {printer.model}</h3>
                            <p>{printer.short_description}</p>
                            <div className="featured-product-actions">
                                <a href="#" className="btn-primary">Voir Détails</a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturedProducts;

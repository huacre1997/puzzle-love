import { useNavigate } from "react-router-dom";

const imageDetails = [
    { id: 'image1', src: '/foto.png', title: 'Imagen 1', cols: 4, rows: 4, total: 16 },
    { id: 'image2', src: '/foto2.jpg', title: 'Imagen 2', cols: 5, rows: 3, total: 15 },
    { id: 'image3', src: '/foto3.png', title: 'Imagen 2', cols: 5, rows: 3, total: 15 },
];

const Puzzles: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = (imageId: string) => {
        // Buscar la imagen seleccionada y sus detalles
        const image = imageDetails.find((image) => image.id === imageId);
        if (image) {
            // Pasar la imagen completa y los detalles en el estado de la navegación
            navigate(`/puzzle/${imageId}`, { state: image });
        }
    };

    return (
        <div className="image-selector">
            <h2>Selecciona una imagen</h2>
            <div className="image-gallery">
                {imageDetails.map(({ id, src, title }) => (
                    <div key={id} className="image-option" onClick={() => handleClick(id)}>
                        <img src={src} alt={title} className="image-thumbnail" />
                        <p>{title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Puzzles;

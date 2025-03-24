import styles from "./SpecialistCategoryPage.module.css"; // Using CSS Modules
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const navigate = useNavigate();

  const specialists = [
    { name: "Cardiologist", image: "/assets/SpecialistCategoryPage/cardio.webp", alt: "cardiac heart" },
    { name: "Neurologist", image: "/assets/SpecialistCategoryPage/neuro.png", alt: "brain" },
    { name: "Orthopedic", image: "/assets/SpecialistCategoryPage/ortho.png", alt: "bones" },
    { name: "Gynaecologist", image: "/assets/SpecialistCategoryPage/gynae.webp", alt: "baby" },
    { name: "Gastroenterologist", image: "/assets/SpecialistCategoryPage/gastro.webp", alt: "gut" },
    { name: "Dentist", image: "/assets/SpecialistCategoryPage/dentist.webp", alt: "teeth" },
    { name: "Dermatologist", image: "/assets/SpecialistCategoryPage/derma.webp", alt: "skin cells" },
    { name: "Urologist", image: "/assets/SpecialistCategoryPage/uro.png", alt: "kidneys" },
    { name: "Psychiatrist", image: "/assets/SpecialistCategoryPage/pshyciatrist.png", alt: "brain" },
  ];

  return (
    <div>
      <header>
        <h1>Find Your Specialist</h1>
      </header>
      <div className={styles.container}>
        <div className={styles.categories}>
          {specialists.map((specialist) => (
            <button
              key={specialist.name}
              className={styles.categoryButton}
              onClick={() => navigate(`/SearchSpecialist/${specialist.name.toLowerCase()}`)}
            >
              <img src={specialist.image} alt={specialist.alt} />
              <p>{specialist.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

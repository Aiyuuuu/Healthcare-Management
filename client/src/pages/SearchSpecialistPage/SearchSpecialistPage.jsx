import styles from "./SearchSpecialistPage.module.css";
import { useParams } from "react-router-dom";
import SearchSpecialists from "../../components/SearchSpecialists/SearchSpecialists"
import SearchResultsGrid from '../../components/SearchResultsGrid/SearchResultsGrid'

const SearchSpecialistPage = () => {
  const { specializationName } = useParams(); // Get the specialist name from the URL
  const formattedSpecializationName =
    specializationName.charAt(0).toUpperCase() + specializationName.slice(1);

const rows = [
    {
      id: 1,
      name: "Dr. Aisha Khan",
      city: "Karachi",
      experience: "5",
      fee: "1500",
      satisfaction: true,
    },
    {
      id: 2,
      name: "Dr. Bilal Ahmed",
      city: "Lahore",
      experience: "8",
      fee: "2000",
      satisfaction: false,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      city: "Islamabad",
      experience: "10",
      fee: "2500",
      satisfaction: true,
    },
    
  ];


  return (
    <div className={`${styles.container}`}>
      <h1 className={`${styles.heading} mb-4`}>Find {formattedSpecializationName + "s"}</h1>
      <SearchSpecialists className={styles.SearchSpecialistsContainer} formattedSpecializationName={formattedSpecializationName}/>
      <SearchResultsGrid className={styles.SearchResultsGridContainer} rows = {rows}/>
    </div>
  );
};

export default SearchSpecialistPage;


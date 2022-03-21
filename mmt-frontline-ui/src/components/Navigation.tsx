import icon from '../assets/uslt-2-git.svg'
import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export const Navigation = () => {
  
  const { t, i18n, ready } = useTranslation();

  const changeLanguage = (lng: string | undefined) => {
    i18n.changeLanguage(lng);
    console.log("Language: " + i18n.language);
  };

  return (
    <header className='header'>
      <img src={icon} alt='icon' />
      <h1>{t("title")}</h1>
      <div className="language">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {t("language")}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => changeLanguage("en")}>English</Dropdown.Item>
            <Dropdown.Item onClick={() => changeLanguage("fr")}>Français</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  )
}

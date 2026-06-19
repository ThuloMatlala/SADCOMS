import { Link } from 'react-router-dom';

interface PageHeaderProps{
  headerText: string;
  parentPageName: string;
  parentPageLink: string;
}

export const PageHeader = ({ headerText, parentPageName, parentPageLink}:PageHeaderProps) =>{
  return (
    <div className='header'>
      <h1>{headerText}</h1>
      <Link to={parentPageLink}>← Back to {parentPageName}</Link>
    </div>
  )
}

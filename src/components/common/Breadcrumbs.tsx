import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="breadcrumbs">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="breadcrumb-separator">/</span>}
                    {item.path ? (
                        <Link to={item.path} className="breadcrumb-link">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="breadcrumb-current">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs; 
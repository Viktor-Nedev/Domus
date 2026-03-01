import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold gradient-text mb-4">DOMUS</h3>
            <p className="text-sm text-muted-foreground">
              Find your place in the world
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">About DOMUS</Link></li>
              <li><Link to="/" className="hover:text-primary">How It Works</Link></li>
              <li><Link to="/" className="hover:text-primary">For Brokers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/" className="hover:text-primary">Help Center</Link></li>
              <li><Link to="/" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 DOMUS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

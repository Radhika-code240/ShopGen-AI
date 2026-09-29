import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, PackageCheck, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || 'U';
}

export default function ProfilePage() {
  const { user, loading, logout, updateProfile } = useAuth();
  const { wishlist } = useWishlist();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  if (loading) {
    return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}><div className="badge-ai">Loading profile...</div></div>;
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
          <UserRound size={42} color="var(--primary)" />
          <h1 style={{ margin: '1rem 0 0.5rem' }}>Sign in to view your account</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Manage your profile, orders, and saved products in one place.</p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const handleSave = (event) => {
    event.preventDefault();
    updateProfile({ name: name.trim() || user.name });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Account</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account details and saved products.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 0.8fr) minmax(320px, 1.2fr)', gap: '1.5rem', alignItems: 'start' }}>
        <section className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ width: '88px', height: '88px', margin: '0 auto 1rem', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: '1.6rem', fontWeight: 800 }}>{getInitials(user.name)}</div>
          <h2 style={{ fontSize: '1.35rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{user.email}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn-secondary"><PackageCheck size={16} /> My Orders</Link>
            <button className="btn-secondary" onClick={logout}><LogOut size={16} /> Logout</button>
          </div>
        </section>

        <section className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Personal Information</h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Full name
              <input className="input-field" value={name} onChange={event => setName(event.target.value)} style={{ marginTop: '0.35rem' }} />
            </label>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Email address
              <input className="input-field" value={user.email} readOnly style={{ marginTop: '0.35rem', opacity: 0.75 }} />
            </label>
            <button type="submit" className="btn-primary" style={{ justifySelf: 'start' }}>{saved ? 'Saved' : 'Save Changes'}</button>
          </form>
        </section>
      </div>

      <section style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Heart size={20} color="var(--accent-red)" />
          <h2 style={{ fontSize: '1.4rem' }}>Wishlist</h2>
        </div>
        {wishlist.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>You have not saved any products yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>{wishlist.map(product => <ProductCard key={product.id || product._id} product={product} />)}</div>
        )}
      </section>
    </main>
  );
}

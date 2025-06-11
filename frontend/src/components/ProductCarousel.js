import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const HostelCarousel = () => {
  const hostelImages = [
  {
    title: 'Beautiful Hostel Front View',
    imgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80',
  },
  {
    title: 'Spacious Dorm Rooms',
    imgUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  },
  {
    title: 'Common Area for Students',
    imgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  },
  {
    title: 'Modern Hostel Facilities',
    imgUrl: 'https://images.unsplash.com/photo-1613138240425-963a7caaece2?auto=format&fit=crop&w=1470&q=80',
  },
];


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏨 Our Hostel Gallery</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        style={styles.swiper}
      >
        {hostelImages.map((item, index) => (
          <SwiperSlide key={index} style={styles.slide}>
            <img src={item.imgUrl} alt={item.title} style={styles.image} />
            <h3 style={styles.title}>{item.title}</h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#1e293b',
  },
  swiper: {
    width: '90%',
    height: '500px',
    margin: 'auto',
  },
  slide: {
    backgroundColor: '#e2e8f0',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
  },
  title: {
    padding: '10px',
    fontSize: '1.2rem',
    backgroundColor: '#334155',
    color: 'white',
  },
};

export default HostelCarousel;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Signup from './components/Signup.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import OTP from './components/OTP.jsx';
import NewPassword from './components/NewPassword.jsx';
import Navbar from './components/NavbarPage.jsx';
import Homepage from './components/Home.jsx';
import AnimeList from './components/Animepagelist.jsx';
import About from './components/Aboutus.jsx';
import Event from './components/event2025.jsx';
import Profile from './components/Profile.jsx';
import Solo from './Page/Solo.jsx';
import IGotCheatSkill from './Page/IGot.jsx';
import ClassroomOfTheElite from './Page/Classroomanime.jsx';
import YourName from './Page/YourName.jsx';
import DaysWithMyStepSister from './Page/DaysWithMy.jsx';
import Horimiya from './Page/Horimiyaanime.jsx';
import BlueLock from './Page/BlueLockanime.jsx';
import DemonSlayer from './Page/DemonSlayeranime.jsx';
import ViralHit from './Page/ViralHitanime.jsx';
import Haikyuu from './Page/Haikyuuanime.jsx';
import BlackClover from './Page/BlackClover.jsx';
import WindBreaker from './Page/WindBreaker.jsx';
import KaijuNo8 from './Page/KaijuNo8.jsx';
import JuJUtsuKaisen from './Page/Jjk.jsx';
import Loader from './components/Loader.jsx';

function App() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 2000);
  }, []);

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/animeList" element={<AnimeList />} />
        <Route path="/about" element={<About />} />
        <Route path="/event" element={<Event />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/SoloLeveling" element={<Solo />} />
        <Route path="/IGotCheatSkillInAnotherWorld" element={<IGotCheatSkill />} />
        <Route path="/classroomOfTheElite" element={<ClassroomOfTheElite />} />
        <Route path="/YourName" element={<YourName />} />
        <Route path="/DaysWithMyStepSister" element={<DaysWithMyStepSister />} />
        <Route path="/Horimiya" element={<Horimiya />} />
        <Route path="/BlueLock" element={<BlueLock />} />
        <Route path="/DemonSlayer" element={<DemonSlayer />} />
        <Route path="/ViralHit" element={<ViralHit />} />
        <Route path="/Haikyuu" element={<Haikyuu />} />
        <Route path="/BlackClover" element={<BlackClover />} />
        <Route path="/WindBreaker" element={<WindBreaker />} />
        <Route path="/KaijuNo8" element={<KaijuNo8 />} />
        <Route path="/JuJUtsuKaisen" element={<JuJUtsuKaisen />} />
      </Routes>
    </Router>
  );
}

export default App;
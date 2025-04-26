import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MdSatelliteAlt } from 'react-icons/md';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import "../Dashboard/Dashboard.css";

const MapUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, map.getZoom(), {
            animate: true,
            duration: 0.5
        });
    }, [position]);
    return null;
};

const SolarFlareEffect = ({ center, storm }) => {
    const map = useMap();
    const radiusRef = useRef(0);
    const circleRef = useRef(null);

    const maxRadius = 2000000;
    const growSpeed = 20;
    const step = 50000;

    useEffect(() => {
        if (!map || !storm) return;

        radiusRef.current = 0;

        if (circleRef.current) {
            map.removeLayer(circleRef.current);
        }

        circleRef.current = L.circle(center, {
            radius: 0,
            color: 'red',
            fillColor: 'red',
            opacity: 0.8,
            fillOpacity: 0.4,
            weight: 2,
        }).addTo(map);

        let fading = false;

        const interval = setInterval(() => {
            if (!circleRef.current) return;

            radiusRef.current += step;

            if (radiusRef.current >= maxRadius) {
                fading = true;
            }

            if (fading) {
                let currentOpacity = circleRef.current.options.opacity;
                let newOpacity = currentOpacity - 0.05;

                if (newOpacity <= 0) {
                    map.removeLayer(circleRef.current);
                    clearInterval(interval);
                } else {
                    circleRef.current.setStyle({
                        opacity: newOpacity,
                        fillOpacity: newOpacity * 0.5,
                    });
                }
            } else {
                circleRef.current.setRadius(radiusRef.current);
            }
        }, growSpeed);

        return () => {
            clearInterval(interval);
            if (circleRef.current) {
                map.removeLayer(circleRef.current);
                circleRef.current = null;
            }
        };
    }, [map, center, storm]);

    return null;
};

const Maps = ({ storm }) => {
    const [satellitePosition, setSatellitePosition] = useState({
        latitude: 33.2778,
        longitude: 75.3412
    });

    const [locationName, setLocationName] = useState("Fetching location...");
    const positionRef = useRef(satellitePosition);

    useEffect(() => {
        positionRef.current = satellitePosition;
    }, [satellitePosition]);

    const satelliteIconHtml = ReactDOMServer.renderToString(
        <MdSatelliteAlt size={40} color="#2a5298" />
    );

    const customIcon = L.divIcon({
        html: satelliteIconHtml,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    const updatePosition = async () => {
        try {
            const response = await axios.post('http://localhost:3050/satellite/move', {
                latitude: positionRef.current.latitude,
                longitude: positionRef.current.longitude
            });

            const data = response.data;

            setSatellitePosition({
                latitude: data.latitude,
                longitude: data.longitude
            });
        } catch (error) {
            console.error("Failed to update satellite position:", error);
        }
    };

    const fetchLocationName = async (lat, lon) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            setLocationName(data.display_name || "Unknown Location");
        } catch (err) {
            console.error("Error fetching location name:", err);
            setLocationName("Unknown Location");
        }
    };

    useEffect(() => {
        const intervalId = setInterval(updatePosition, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetchLocationName(satellitePosition.latitude, satellitePosition.longitude);
    }, [satellitePosition]);

    const position = [satellitePosition.latitude, satellitePosition.longitude];

    return (
        <>
            <div className="right-ui-navbar">
                <div className="position">
                    <strong>Latitude:</strong> <span>{satellitePosition.latitude.toFixed(5)}</span><br />
                    <strong>Longitude:</strong> <span>{satellitePosition.longitude.toFixed(5)}</span><br />
                    <strong>Location:</strong> <span>{locationName}</span>
                </div>
            </div>
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater position={position} />
                <SolarFlareEffect center={position} storm={storm} />
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        <strong>Trivedam-1 Satellite</strong><br />
                        {locationName}
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    );
};

export default Maps;

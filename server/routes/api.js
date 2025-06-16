const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Weather API endpoint
router.get('/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const weatherData = {
            location: response.data.name,
            temperature: Math.round(response.data.main.temp),
            description: response.data.weather[0].description,
            condition: response.data.weather[0].main.toLowerCase()
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Spotify API endpoints
const SPOTIFY_TOKEN = 'BQC0CSELL5Omj3MQEYzskhHm4ZmGhmt9TZ31TZjZH1RlPQYEq6ufQDx8oad-KYHuefqDAKDvU9EQuG1obcZlqBnbkxqURwxSs-6_rfta1y6rdapnJ1u4YvtJo7Z2psgf1v41L4F22pL0CQE5Q0x2xS7o6E46iYFdiJ3BRUpgzjefD01pAThNPawZOZbqarOkgtaUUHe-Dy0CIt3oDDWegpjp-fbYqXmteAAR4gFMgV6JM2oHXbOVhaA8ILqnD_ZTAx3z1Y3qhuDcU1iEh0unGbMAreMPHIimJOiVwQV2m6pmfyzNldgMKGpnLdom';

async function fetchSpotifyApi(endpoint, method = 'GET', body = null) {
    try {
        const response = await axios({
            url: `https://api.spotify.com/${endpoint}`,
            method,
            headers: {
                'Authorization': `Bearer ${SPOTIFY_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: body
        });
        return response.data;
    } catch (error) {
        console.error('Spotify API Error:', error.response?.data || error.message);
        throw error;
    }
}

// Get user's top tracks
router.get('/spotify/top-tracks', async (req, res) => {
    try {
        const topTracks = await fetchSpotifyApi('v1/me/top/tracks?time_range=long_term&limit=5');
        res.json(topTracks.items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top tracks' });
    }
});

// Get weather-based playlist
router.get('/spotify/playlist', async (req, res) => {
    try {
        const { mood } = req.query;
        
        // Map moods to Spotify playlist IDs
        const moodPlaylists = {
            'happy': '37i9dQZF1DX3Ogo9pFvBkY', // Happy Hits
            'chill': '37i9dQZF1DX3YSRoSdA634', // Chill Hits
            'melancholy': '37i9dQZF1DX7qK8ma5wgG1', // Sad Songs
            'cozy': '37i9dQZF1DX5KpP2LNQJ3D', // Cozy Acoustic
            'intense': '37i9dQZF1DX76Wlfdnj7AP', // Beast Mode
            'relaxed': '37i9dQZF1DX3Ogo9pFvBkY', // Relaxing
            'mysterious': '37i9dQZF1DX4WYpdgoIcn6', // Mysterious
            'neutral': '37i9dQZF1DXcBWIGoYBM5M'  // Today's Top Hits
        };

        const playlistId = moodPlaylists[mood] || moodPlaylists.neutral;
        
        // Get playlist details
        const playlist = await fetchSpotifyApi(`v1/playlists/${playlistId}`);
        
        res.json({
            embedUrl: `https://open.spotify.com/embed/playlist/${playlistId}`,
            name: playlist.name,
            description: playlist.description,
            tracks: playlist.tracks.items.slice(0, 5).map(item => ({
                name: item.track.name,
                artist: item.track.artists.map(artist => artist.name).join(', '),
                image: item.track.album.images[0]?.url
            }))
        });
    } catch (error) {
        console.error('Spotify Playlist Error:', error);
        res.status(500).json({ error: 'Failed to fetch Spotify playlist' });
    }
});

// Pinterest API endpoint
router.get('/pinterest/random', async (req, res) => {
    try {
        const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
        const boardId = process.env.PINTEREST_BOARD_ID;

        // Fetch random pins from a board
        const response = await axios.get(
            `https://api.pinterest.com/v1/boards/${boardId}/pins/`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    limit: 12,
                    fields: 'image,note'
                }
            }
        );

        const images = response.data.data.map(pin => ({
            url: pin.image.original.url,
            title: pin.note
        }));

        res.json({ images });
    } catch (error) {
        console.error('Pinterest API Error:', error);
        res.status(500).json({ error: 'Failed to fetch Pinterest images' });
    }
});

module.exports = router; 
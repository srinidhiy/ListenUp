import { formatAlbumDate, formatDuration } from "./utils";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

interface SimplifiedAlbum {
    id: string;
    name: string;
    artists: string;
    img_url: string;
    release_date: string;
}

interface Track {
    id: string;
    artists: string;
    duration: string;
    explicit: boolean;
    name: string;
    preview_url: string;
    track_number: number;
}

interface Album {
    id: string;
    name: string;
    artists: string;
    img_url: string;
    release_date: string;
    tracks: Track[];
    total_runtime: number;
}

export async function getAccessToken() {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    const data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', refreshToken!);
    try {
        const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
        })

        const responseData = await response.json();
        return responseData.access_token;
    } catch(error: any) {
        throw new Error(`Error refreshing token: ${error}`)
    }
}

export async function getNewReleases() {
    const newToken = await getAccessToken();
    // console.log("new token: " + newToken);
    var parameters = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + newToken
        }        
    }
    var response = await fetch("https://api.spotify.com/v1/browse/new-releases?country=us&limit=10", parameters)
    const responseData = await response.json();
    const albums: Album[] = responseData.albums.items.map((album: any) => ({
        id: album.id,
        name: album.name,
        artists: album.artists.map((artist: any) => artist.name).join(', '),
        img_url: album.images[0].url,
        release_date: formatAlbumDate(album.release_date),
    }))

    return albums;

}

export async function searchAlbums(searchString: string) {
    const newToken = await getAccessToken();
    const formattedQuery = encodeURIComponent(searchString);
    var parameters = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + newToken
        }        
    }
    var response = await fetch(`https://api.spotify.com/v1/search?q=${formattedQuery}&type=album`, parameters)
    const responseData = await response.json();
    const albums: SimplifiedAlbum[] = responseData.albums.items.map((album: any) => ({
        id: album.id,
        name: album.name,
        artists: album.artists.map((artist: any) => artist.name).join(', '),
        img_url: album.images[0].url,
        release_date: formatAlbumDate(album.release_date),
    }))

    return albums;
}

export async function getAlbumInfo(id: string) {
    const newToken = await getAccessToken();
    var parameters = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + newToken
        }        
    }
    var response = await fetch(`https://api.spotify.com/v1/albums/${id}`, parameters)
    const responseData = await response.json();
    const tracks: Track[] = responseData.tracks.items.map((track: any) => ({
        id: track.id,
        artists: track.artists.map((artist: any) => artist.name).join(', '),
        duration: formatDuration(track.duration_ms),
        explicit: track.explicit,
        name: track.name,
        preview_url: track.preview_url,
        track_number: track.track_number,
    }))

    const initialValue = 0;
    const totalRuntime = formatDuration(responseData.tracks.items.reduce((accumulator: number, currentTrack: any) => accumulator + currentTrack.duration_ms, initialValue));

    return {
        id: responseData.id,
        name: responseData.name,
        artists: responseData.artists.map((artist: any) => artist.name).join(', '),
        img_url: responseData.images[0].url,
        release_date: formatAlbumDate(responseData.release_date),
        tracks: tracks,
        total_runtime: totalRuntime,
    };

}
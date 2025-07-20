import { type Summary, type Catalog, type Episode, type Movie, type Serie, type Subtitle } from "../../../types/content";
import type { Profile, RemoteImage } from "../../../types/profile";
import type { Heartbeat } from "../../../types/streamitTypes";
import { getAbsoluteUrl, WebGet } from "./apiClient";


export async function GetHeartbeat(serverAddress: string): Promise<Heartbeat | null> {
    const response = await WebGet<Heartbeat>(serverAddress, ["heartbeat"]);
    return response.data;
}

export async function GetIsDelegateRequired(serverAddress: string): Promise<boolean> {
    const response = await WebGet<boolean>(serverAddress, ["auth", "delegate", "required"]);
    return response.data;
}


export async function Profiles(): Promise<Profile[]> {
    const response = await WebGet<Profile[]>(["user"]);
    return response.data.map(item => ({
        ...item,
        imageSrc: getAbsoluteUrl(response.url, ["assets", "profile-image", item.image])
    }))
}

export async function GetProfileImages(): Promise<RemoteImage[]> { 
  const response = await WebGet<string[]>(["assets", "profile-image"]);
  console.log(response)
  return response.data.map(item => ({
    image: item,
    imageSrc: getAbsoluteUrl(response.url, ["assets", "profile-image", item])
  }))
}

export async function GetByIds(ids: number[]): Promise<Catalog[]> {
  const idsToLookup = ids.map(id => id.toString()).join(",");
  const response = await WebGet<Catalog[]>(["catalog", "get", idsToLookup]);
  return response.data
    .map(item => { return {
      ...item,
      coverSrc: setCoverSrc(response.url, item)
    }})
}

export async function GetNew(): Promise<Catalog[]> {
  const response = await WebGet<Catalog[]>(["catalog", "new"]);
  return response.data
    .map(item => { return {
      ...item,
      coverSrc: setCoverSrc(response.url, item)
    }})
}

export async function GetUpdated(): Promise<Catalog[]> {
  const response = await WebGet<Catalog[]>(["catalog", "updated"]);
  return response.data
    .map(item => { return {
      ...item,
      coverSrc: setCoverSrc(response.url, item)
    }})
}

export async function MovieCatalog(): Promise<Catalog[]> {
  const response = await WebGet<Catalog[]>(["catalog", "movie"]);

  return response.data
    .map(item => { return {
      ...item,
      coverSrc: setCoverSrc(response.url, item)
    }})
}

export async function SerieCatalog(): Promise<Catalog[]> {
  const response = await WebGet<Catalog[]>(["catalog", "serie"]);
  
  return response.data
    .map(item => { return {
      ...item,
      coverSrc: setCoverSrc(response.url, item)
    }})
}

export async function GetSerie(catalog: Catalog): Promise<Serie> {
  const responseTest = await WebGet<string>(["catalog", "serie", catalog.collection]);
  console.log("GetSerie", responseTest.data);
  const response = await WebGet<Serie>(["catalog", "serie", catalog.collection]);
  const content = response.data
  console.log("GetSerie", content);
  return {
    ...content,
    coverSrc: setCoverSrc(response.url, catalog),
    episodes: setEpisodeSrc(response.url, content)
  }
}

export async function GetMovie(catalog: Catalog): Promise<Movie> {
  const response = await WebGet<Movie>(["catalog", "movie", catalog.id.toString()]);
  return {
    ...response.data,
    coverSrc: setCoverSrc(response.url, catalog),
    videoSrc: getAbsoluteUrl(response.url, ["stream", "media", "video", catalog.collection, response.data.video]),
  }
}

export async function GetSummary(id: number): Promise<Summary[]> {
  const response = await WebGet<Summary[]>(["summary", id.toString()])
  return response.data;
}





function setEpisodeSrc(baseUrl: string, item: Serie): Episode[] {
    return item.episodes.map((episode, index) => {
      return {
        ...episode,
        videoSrc: getAbsoluteUrl(baseUrl, ["stream", "media", "video", item.collection, episode.video]),
        subtitles: setSubtitleSrc(baseUrl, item.collection, episode.subtitles)
      } as Episode
    });
}

function setSubtitleSrc(baseUrl: string, collection: string, subtitles: Subtitle[]): Subtitle[] {
  return subtitles.map((subtitle, index) => {
    return {
      ...subtitle,
      subtitleSrc: getAbsoluteUrl(baseUrl, ["stream", "media", "subtitle", collection, subtitle.language, subtitle.subtitle])
    }
  })
}

function setCoverSrc(baseUrl: string, item: Catalog): string | undefined {
  return item.cover
      ? getAbsoluteUrl(baseUrl, ["stream", "media", "image", item.collection, item.cover])
      : undefined
}


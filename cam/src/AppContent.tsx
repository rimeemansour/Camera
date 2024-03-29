import React, { createContext, useReducer, useContext, ReactNode } from 'react';

export interface IImage {
  id?: string;
  name?: string;
  longitude?:number
  latitude?:number;
  handleDelete?: (id: string) => void;
  onClickFunction?:(id:string)=>void;
}

interface ImagesProviderProps {
  children: ReactNode;
}

interface ImagesState {
  images: IImage[];
  showGallery: boolean;
}


type Action =
  | { type: 'ADD_IMAGE'; payload: IImage }
  | { type: 'TOGGLE_GALLERY' };


const initialState: ImagesState = {
  images: [], 
  showGallery: false,
};

const reducer = (state: ImagesState, action: Action): ImagesState => {

  switch (action.type) {
    case 'ADD_IMAGE':
    
      return {
        ...state,
        images: [...state.images, action.payload],
      };
    case 'TOGGLE_GALLERY':
      return {
        ...state,
        showGallery: !state.showGallery, 
      };
    default:
      return state;
  }
};

const PlaceContext = createContext<{
  state: ImagesState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });


export const ImageProvider: React.FC<ImagesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PlaceContext.Provider value={{ state, dispatch }}>
      {children}
    </PlaceContext.Provider>
  );
};


export const useImagesStore = () => useContext(PlaceContext);


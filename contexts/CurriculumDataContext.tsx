import createContextHook from '@nkzw/create-context-hook';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

type RawDataStructure = {
  [grado: string]: {
    [campoFormativo: string]: {
      contenidos: string[];
      byContenido: {
        [contenido: string]: string[];
      };
    };
  };
};

const GIST_URL = 'https://gist.githubusercontent.com/CePCCo-Asesores/1b5c2b801574343fcfe845c24a4c719c/raw/0f22147487eee721d9c065b5f643c3e9712f9c09/CON_PLAN.JSON';

export const [CurriculumDataProvider, useCurriculumData] = createContextHook(() => {
  const { data, isLoading, error } = useQuery<RawDataStructure>({
    queryKey: ['curriculumData'],
    queryFn: async () => {
      try {
        console.log('Fetching curriculum data from:', GIST_URL);
        const response = await fetch(GIST_URL);
        if (!response.ok) {
          throw new Error(`Error al cargar datos curriculares: ${response.status}`);
        }
        const rawData = await response.json() as RawDataStructure;
        console.log('Raw curriculum data loaded, type:', typeof rawData);
        console.log('Is object:', typeof rawData === 'object');
        console.log('Keys:', Object.keys(rawData));
        
        if (typeof rawData !== 'object' || Array.isArray(rawData)) {
          console.error('Invalid data structure: expected object, got:', typeof rawData);
          throw new Error('Invalid data structure: expected object');
        }

        console.log('✅ Curriculum data loaded successfully');
        return rawData;
      } catch (err) {
        console.error('Error fetching curriculum data:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const getContenidosByCampos = useCallback((campos: string[], nivel: string, grado: string): string[] => {
    console.log('=== getContenidosByCampos called ===');
    console.log('Campos received:', campos);
    console.log('Nivel received:', nivel);
    console.log('Grado received:', grado);
    console.log('Data available:', !!data);
    console.log('Data is object:', typeof data === 'object');
    
    if (!data || typeof data !== 'object' || campos.length === 0) {
      console.log('❌ Early return: No data or no campos selected');
      return [];
    }

    const gradoKey = convertirGradoAKey(nivel, grado);
    console.log('Grado key:', gradoKey);
    console.log('Available grados in data:', Object.keys(data));
    
    if (!data[gradoKey]) {
      console.log('❌ No data for grado:', gradoKey);
      return [];
    }

    const contenidosSet = new Set<string>();
    
    campos.forEach(campo => {
      const campoData = data[gradoKey]?.[campo];
      console.log(`Campo "${campo}" data:`, campoData);
      
      if (campoData && campoData.contenidos) {
        campoData.contenidos.forEach(contenido => contenidosSet.add(contenido));
      }
    });

    const result = Array.from(contenidosSet);
    console.log('✅ Total contenidos extracted:', result.length);
    console.log('Contenidos:', result);
    return result;
  }, [data]);

  const getPDAByContenidos = useCallback((campos: string[], contenidos: string[], nivel: string, grado: string): string[] => {
    console.log('=== getPDAByContenidos called ===');
    console.log('Campos received:', campos);
    console.log('Contenidos received:', contenidos);
    console.log('Nivel received:', nivel);
    console.log('Grado received:', grado);
    console.log('Data available:', !!data);
    
    if (!data || typeof data !== 'object' || campos.length === 0 || contenidos.length === 0) {
      console.log('❌ Early return: No data or no selection', { 
        hasData: !!data,
        isObject: typeof data === 'object',
        camposCount: campos.length, 
        contenidosCount: contenidos.length 
      });
      return [];
    }

    const gradoKey = convertirGradoAKey(nivel, grado);
    console.log('Grado key:', gradoKey);
    
    if (!data[gradoKey]) {
      console.log('❌ No data for grado:', gradoKey);
      return [];
    }

    const pdaSet = new Set<string>();
    
    campos.forEach(campo => {
      const campoData = data[gradoKey]?.[campo];
      
      if (campoData && campoData.byContenido) {
        contenidos.forEach(contenido => {
          const pdaDeEsteContenido = campoData.byContenido[contenido] || [];
          console.log(`PDAs for campo "${campo}" contenido "${contenido}":`, pdaDeEsteContenido);
          pdaDeEsteContenido.forEach(pda => pdaSet.add(pda));
        });
      }
    });

    const result = Array.from(pdaSet).sort();
    console.log('✅ Total PDAs extracted:', result.length);
    console.log('PDAs:', result);
    return result;
  }, [data]);

  function convertirGradoAKey(nivel: string, grado: string): string {
    const gradoNum = parseInt(grado);
    
    switch (nivel) {
      case 'Preescolar':
        return String(gradoNum);
      case 'Primaria':
        return String(gradoNum + 3);
      case 'Secundaria':
        return String(gradoNum + 9);
      default:
        return grado;
    }
  }

  const contextValue = useMemo(() => ({
    data: data || {} as RawDataStructure,
    isLoading,
    error,
    getContenidosByCampos,
    getPDAByContenidos,
  }), [data, isLoading, error, getContenidosByCampos, getPDAByContenidos]);

  return contextValue;
});

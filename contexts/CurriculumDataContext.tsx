import createContextHook from '@nkzw/create-context-hook';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

interface CurriculumDataItem {
  nivel: string;
  grado: string;
  campoFormativo: string;
  contenido: string;
  pda: string[];
}

type CurriculumDataStructure = CurriculumDataItem[];

type RawDataStructure = {
  [grado: string]: {
    [campoFormativo: string]: {
      contenidos: string[];
      pda: { [key: string]: string }[];
    };
  };
};

const GIST_URL = 'https://gist.githubusercontent.com/CePCCo-Asesores/1b5c2b801574343fcfe845c24a4c719c/raw/0f22147487eee721d9c065b5f643c3e9712f9c09/CON_PLAN.JSON';

export const [CurriculumDataProvider, useCurriculumData] = createContextHook(() => {
  const { data, isLoading, error } = useQuery<CurriculumDataStructure>({
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
          return [];
        }

        const transformedData: CurriculumDataItem[] = [];
        
        Object.entries(rawData).forEach(([grado, camposData]) => {
          console.log(`Processing grado: ${grado}`);
          
          Object.entries(camposData).forEach(([campoFormativo, campoData]) => {
            console.log(`  Processing campo: ${campoFormativo}`);
            
            const contenidos = campoData.contenidos || [];
            const pdaObjects = campoData.pda || [];
            
            contenidos.forEach((contenido) => {
              const pdaStrings: string[] = [];
              
              pdaObjects.forEach((pdaObj) => {
                Object.values(pdaObj).forEach((value) => {
                  if (typeof value === 'string') {
                    pdaStrings.push(value);
                  }
                });
              });
              
              let nivel = 'Primaria';
              const gradoNum = parseInt(grado);
              if (gradoNum >= 1 && gradoNum <= 3) {
                nivel = 'Preescolar';
              } else if (gradoNum >= 4 && gradoNum <= 9) {
                nivel = 'Primaria';
                grado = String(gradoNum - 3);
              } else if (gradoNum >= 10 && gradoNum <= 12) {
                nivel = 'Secundaria';
                grado = String(gradoNum - 9);
              }
              
              transformedData.push({
                nivel,
                grado,
                campoFormativo: campoFormativo.toUpperCase(),
                contenido,
                pda: pdaStrings,
              });
            });
          });
        });

        console.log('✅ Total transformed items:', transformedData.length);
        console.log('Sample transformed item:', transformedData[0]);
        return transformedData;
      } catch (err) {
        console.error('Error fetching curriculum data:', err);
        return [];
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
    console.log('Data is array:', Array.isArray(data));
    console.log('Data length:', data?.length);
    
    if (!Array.isArray(data) || data.length === 0 || campos.length === 0) {
      console.log('❌ Early return: No data or no campos selected');
      return [];
    }

    const contenidos = data
      .filter(item => 
        campos.includes(item.campoFormativo) &&
        item.nivel === nivel &&
        item.grado === grado
      )
      .map(item => item.contenido);

    const uniqueContenidos = Array.from(new Set(contenidos));

    console.log('✅ Total contenidos extracted:', uniqueContenidos.length);
    console.log('Contenidos:', uniqueContenidos);
    return uniqueContenidos;
  }, [data]);

  const getPDAByContenidos = useCallback((campos: string[], contenidos: string[], nivel: string, grado: string): string[] => {
    console.log('=== getPDAByContenidos called ===');
    console.log('Campos received:', campos);
    console.log('Contenidos received:', contenidos);
    console.log('Nivel received:', nivel);
    console.log('Grado received:', grado);
    console.log('Data available:', !!data);
    
    if (!Array.isArray(data) || data.length === 0 || campos.length === 0 || contenidos.length === 0) {
      console.log('❌ Early return: No data or no selection', { 
        hasData: !!data,
        isArray: Array.isArray(data),
        camposCount: campos.length, 
        contenidosCount: contenidos.length 
      });
      return [];
    }

    const pdaList = data
      .filter(item => 
        campos.includes(item.campoFormativo) && 
        contenidos.includes(item.contenido) &&
        item.nivel === nivel &&
        item.grado === grado
      )
      .flatMap(item => item.pda || []);

    const uniquePDAs = Array.from(new Set(pdaList));

    console.log('✅ Total PDAs extracted:', uniquePDAs.length);
    console.log('PDAs:', uniquePDAs);
    return uniquePDAs;
  }, [data]);

  const contextValue = useMemo(() => ({
    data: data || [],
    isLoading,
    error,
    getContenidosByCampos,
    getPDAByContenidos,
  }), [data, isLoading, error, getContenidosByCampos, getPDAByContenidos]);

  return contextValue;
});

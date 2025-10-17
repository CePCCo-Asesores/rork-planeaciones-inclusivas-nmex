import createContextHook from '@nkzw/create-context-hook';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

type RawGistStructure = {
  [grado: string]: {
    [campoFormativo: string]: {
      contenidos: string[];
      pda: string[];
    };
  };
};

type TransformedDataStructure = {
  [grado: string]: {
    [campoFormativo: string]: {
      contenidos: string[];
      byContenido: {
        [contenido: string]: string[];
      };
    };
  };
};

function separarPDAs(cadenaDeTexto: string): string[] {
  if (!cadenaDeTexto || typeof cadenaDeTexto !== 'string') return [];

  if (cadenaDeTexto.includes('(1)') || cadenaDeTexto.includes('(2)')) {
    return cadenaDeTexto.split(/\(\d+\)\s*/).filter(texto => texto.trim());
  }

  const oraciones = cadenaDeTexto.split(/\.\s+(?=[A-Z])/).filter(texto => texto.trim());
  if (oraciones.length > 1) {
    return oraciones.map((oracion, index) => {
      const oracionLimpia = oracion.trim();
      if (index < oraciones.length - 1 && !oracionLimpia.endsWith('.')) {
        return oracionLimpia + '.';
      }
      return oracionLimpia;
    });
  }

  return [cadenaDeTexto.trim()];
}

function transformGistData(rawData: RawGistStructure): TransformedDataStructure {
  console.log('🔄 Transforming Gist data...');
  const transformed: TransformedDataStructure = {};

  Object.keys(rawData).forEach(gradoKey => {
    transformed[gradoKey] = {};
    const gradoData = rawData[gradoKey];

    Object.keys(gradoData).forEach(campoFormativo => {
      const campoData = gradoData[campoFormativo];
      
      if (!campoData.contenidos || !Array.isArray(campoData.contenidos)) {
        console.warn(`⚠️ No contenidos array for ${gradoKey}/${campoFormativo}`);
        return;
      }

      const pdaArray = campoData.pda || [];
      const contenidosArray = campoData.contenidos;

      console.log(`   📊 Campo: ${campoFormativo}`);
      console.log(`      Contenidos: ${contenidosArray.length}`);
      console.log(`      PDAs: ${pdaArray.length}`);
      if (contenidosArray.length > 0) {
        console.log(`      Primer contenido: "${contenidosArray[0].substring(0, 50)}..."`);
      }
      if (pdaArray.length > 0) {
        console.log(`      Primer PDA: "${pdaArray[0].substring(0, 50)}..."`);
      }

      const byContenido: { [contenido: string]: string[] } = {};

      contenidosArray.forEach((contenido, index) => {
        const pdaSet = new Set<string>();

        if (pdaArray[index]) {
          console.log(`         🔗 Contenido[${index}] -> PDA[${index}]`);
          console.log(`            Contenido: "${contenido.substring(0, 40)}..."`);
          console.log(`            PDA raw: "${pdaArray[index].substring(0, 40)}..."`);
          const pdaIndividuales = separarPDAs(pdaArray[index]);
          console.log(`            PDA split: ${pdaIndividuales.length} items`);
          pdaIndividuales.forEach(pda => pdaSet.add(pda));
        } else {
          console.warn(`         ⚠️ Contenido[${index}] NO tiene PDA en index ${index}`);
        }

        byContenido[contenido] = Array.from(pdaSet);
      });

      console.log(`   ✅ byContenido keys: ${Object.keys(byContenido).length}`);

      transformed[gradoKey][campoFormativo] = {
        contenidos: contenidosArray,
        byContenido,
      };

      console.log(`✅ Transformed ${gradoKey}/${campoFormativo}: ${contenidosArray.length} contenidos`);
    });
  });

  console.log('✅ Transformation complete');
  return transformed;
}

const GIST_URL = 'https://gist.githubusercontent.com/CePCCo-Asesores/1b5c2b801574343fcfe845c24a4c719c/raw/0f22147487eee721d9c065b5f643c3e9712f9c09/CON_PLAN.JSON';

export const [CurriculumDataProvider, useCurriculumData] = createContextHook(() => {
  const { data, isLoading, error } = useQuery<TransformedDataStructure>({
    queryKey: ['curriculumData'],
    queryFn: async () => {
      try {
        console.log('📥 Fetching curriculum data from:', GIST_URL);
        const response = await fetch(GIST_URL);
        if (!response.ok) {
          throw new Error(`Error al cargar datos curriculares: ${response.status}`);
        }
        const rawData = await response.json() as RawGistStructure;
        console.log('📦 Raw curriculum data loaded, type:', typeof rawData);
        console.log('📦 Is array:', Array.isArray(rawData));
        console.log('📦 Is object:', typeof rawData === 'object' && !Array.isArray(rawData));
        
        if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
          console.error('❌ Invalid data structure: expected object, got:', Array.isArray(rawData) ? 'array' : typeof rawData);
          throw new Error('Invalid data structure: expected object, got ' + (Array.isArray(rawData) ? 'array' : typeof rawData));
        }
        
        const gradoKeys = Object.keys(rawData);
        console.log('📦 Grado keys:', gradoKeys);
        
        if (gradoKeys.length === 0) {
          console.error('❌ Empty data structure');
          throw new Error('Empty data structure');
        }

        const transformedData = transformGistData(rawData);
        console.log('✅ Curriculum data loaded and transformed successfully');
        return transformedData;
      } catch (err) {
        console.error('❌ Error fetching curriculum data:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const getContenidosByCampos = useCallback((campos: string[], nivel: string, grado: string): Array<{ contenido: string; campo: string }> => {
    console.log('=== getContenidosByCampos called ===');
    console.log('📋 Campos received:', campos);
    console.log('📚 Nivel received:', nivel);
    console.log('🎓 Grado received:', grado);
    
    if (!data || typeof data !== 'object' || campos.length === 0) {
      console.log('❌ Early return: No data or no campos selected');
      return [];
    }

    const gradoKey = convertirGradoAKey(nivel, grado);
    console.log('🔑 Grado key calculated:', gradoKey);
    console.log('📦 Available grados in data:', Object.keys(data));
    
    if (!data[gradoKey]) {
      console.log('❌ No data for grado key:', gradoKey);
      return [];
    }

    console.log('✅ Found data for grado:', gradoKey);
    console.log('📂 Available campos in grado:', Object.keys(data[gradoKey]));

    const contenidosConCampo: Array<{ contenido: string; campo: string }> = [];
    
    campos.forEach(campo => {
      console.log(`\n🔍 Processing campo: "${campo}"`);
      const campoData = data[gradoKey]?.[campo];
      
      if (!campoData) {
        console.log(`⚠️ No data found for campo "${campo}" in grado ${gradoKey}`);
        return;
      }
      
      if (!campoData.contenidos || !Array.isArray(campoData.contenidos)) {
        console.log(`⚠️ No contenidos array for campo "${campo}"`);
        return;
      }
      
      console.log(`📝 Found ${campoData.contenidos.length} contenidos for campo "${campo}"`);
      
      campoData.contenidos.forEach((contenido, index) => {
        contenidosConCampo.push({ contenido, campo });
        console.log(`  [${index}] Added: "${contenido.substring(0, 50)}..." from campo "${campo}"`);
      });
    });

    console.log(`\n✅ Total contenidos extracted: ${contenidosConCampo.length}`);
    return contenidosConCampo;
  }, [data]);

  const getPDAByContenidos = useCallback((contenidosConCampo: Array<{ contenido: string; campo: string }>, nivel: string, grado: string): string[] => {
    console.log('\n=== getPDAByContenidos called ===');
    console.log('📥 Received', contenidosConCampo.length, 'contenidos con campo');
    console.log('📋 Full contenidos array:', JSON.stringify(contenidosConCampo.map(c => ({ campo: c.campo, contenidoPreview: c.contenido.substring(0, 30) })), null, 2));
    
    if (!data || typeof data !== 'object' || contenidosConCampo.length === 0) {
      console.log('❌ Early return:', { 
        hasData: !!data,
        isObject: typeof data === 'object',
        contenidosCount: contenidosConCampo.length 
      });
      return [];
    }

    const gradoKey = convertirGradoAKey(nivel, grado);
    console.log('🔑 Grado key:', gradoKey);
    console.log('📂 Available campos in this grado:', Object.keys(data[gradoKey] || {}));
    
    if (!data[gradoKey]) {
      console.log('❌ No data for grado:', gradoKey);
      return [];
    }

    const pdaSet = new Set<string>();
    let totalPdaCadenasFound = 0;
    let totalPdaIndividualesFound = 0;
    
    contenidosConCampo.forEach(({ contenido, campo }, index) => {
      console.log(`\n🔍 [${index + 1}/${contenidosConCampo.length}] Processing:`);
      console.log(`   Campo recibido: "${campo}"`);
      console.log(`   Contenido recibido: "${contenido.substring(0, 60)}..."`);
      
      console.log(`   🔎 Buscando en: data["${gradoKey}"]["${campo}"]`);
      const campoData = data[gradoKey]?.[campo];
      
      if (!campoData) {
        console.log(`   ❌ CRÍTICO: No existe data["${gradoKey}"]["${campo}"]`);
        console.log(`   Campos disponibles en data["${gradoKey}"]:`, Object.keys(data[gradoKey]));
        return;
      }
      
      console.log(`   ✅ Campo encontrado: "${campo}"`);
      
      if (!campoData.byContenido) {
        console.log(`   ⚠️ No byContenido structure in campo "${campo}"`);
        return;
      }
      
      console.log(`   🔎 Buscando contenido exacto en byContenido...`);
      const pdaDeEsteContenido = campoData.byContenido[contenido];
      
      if (!pdaDeEsteContenido || pdaDeEsteContenido.length === 0) {
        console.log(`   ❌ No se encontró PDA para este contenido específico`);
        console.log(`   Contenidos disponibles en byContenido (primeros 3):`);
        Object.keys(campoData.byContenido).slice(0, 3).forEach(key => {
          console.log(`      - "${key.substring(0, 60)}..."`);
        });
        console.log(`   ⚠️ Comparación: contenido buscado = "${contenido.substring(0, 60)}..."`);
        return;
      }
      
      console.log(`   ✅ Found ${pdaDeEsteContenido.length} PDA cadena(s)`);
      totalPdaCadenasFound += pdaDeEsteContenido.length;
      
      pdaDeEsteContenido.forEach((cadena, cadenaIndex) => {
        console.log(`   📄 Cadena ${cadenaIndex + 1}: "${cadena.substring(0, 80)}..."`);
        const pdaIndividuales = separarPDAs(cadena);
        console.log(`      ➡️ Split into ${pdaIndividuales.length} individual PDA(s)`);
        
        pdaIndividuales.forEach(pda => {
          const wasNew = !pdaSet.has(pda);
          pdaSet.add(pda);
          if (wasNew) {
            totalPdaIndividualesFound++;
            console.log(`      ✨ New PDA added: "${pda.substring(0, 60)}..."`);
          } else {
            console.log(`      🔁 Duplicate PDA (skipped): "${pda.substring(0, 60)}..."`);
          }
        });
      });
    });

    const result = Array.from(pdaSet).sort();
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total PDA cadenas found: ${totalPdaCadenasFound}`);
    console.log(`   Total individual PDAs (unique): ${result.length}`);
    console.log(`\n✅ Returning ${result.length} PDAs`);
    
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
    data: data || {} as TransformedDataStructure,
    isLoading,
    error,
    getContenidosByCampos,
    getPDAByContenidos,
  }), [data, isLoading, error, getContenidosByCampos, getPDAByContenidos]);

  return contextValue;
});

import createContextHook from '@nkzw/create-context-hook';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

type RawGistStructure = {
  [grado: string]: {
    [campoFormativo: string]: {
      contenidos: string[];
      // En el JSON digerido puede venir directamente byContenido
      byContenido?: {
        [contenido: string]: string[];
      };
      // O puede venir un arreglo paralelo a contenidos, cuyos elementos pueden ser string o string[]
      pda?: Array<string | string[]>;
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

  console.log('🔪 separarPDAs input:', cadenaDeTexto.substring(0, 100) + '...');

  if (cadenaDeTexto.includes('(1)') || cadenaDeTexto.includes('(2)')) {
    const partes = cadenaDeTexto.split(/\(\d+\)\s*/).filter(texto => texto.trim().length > 0);
    console.log(`   ✂️ Split by (1), (2): ${partes.length} partes`);
    partes.forEach((parte, i) => {
      console.log(`      [${i}] "${parte.substring(0, 60)}..."`);
    });
    return partes;
  }

  const oraciones = cadenaDeTexto.split(/\.\s+(?=[A-Z])/).filter(texto => texto.trim().length > 0);
  console.log(`   ✂️ Split by sentence: ${oraciones.length} oraciones`);
  
  if (oraciones.length > 1) {
    const resultado = oraciones.map((oracion, index) => {
      const oracionLimpia = oracion.trim();
      if (index < oraciones.length - 1 && !oracionLimpia.endsWith('.')) {
        return oracionLimpia + '.';
      }
      return oracionLimpia;
    });
    resultado.forEach((oracion, i) => {
      console.log(`      [${i}] "${oracion.substring(0, 60)}..."`);
    });
    return resultado;
  }

  console.log('   ℹ️ No split needed, returning original');
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

      const contenidosArray = campoData.contenidos;

      // Si el JSON ya trae byContenido, úsalo directamente
      if (campoData.byContenido && typeof campoData.byContenido === 'object') {
        console.log(`   ✅ Using provided byContenido for ${gradoKey}/${campoFormativo}`);
        transformed[gradoKey][campoFormativo] = {
          contenidos: contenidosArray,
          byContenido: campoData.byContenido,
        };
        return;
      }

      const pdaArray = (campoData.pda ?? []) as Array<string | string[]>;

      console.log(`   📊 Campo: ${campoFormativo}`);
      console.log(`      Contenidos: ${contenidosArray.length}`);
      console.log(`      PDAs: ${pdaArray.length}`);
      if (contenidosArray.length > 0) {
        console.log(`      Primer contenido: "${contenidosArray[0].substring(0, 50)}..."`);
      }
      if (pdaArray.length > 0) {
        const firstPda = pdaArray[0];
        console.log(
          `      Primer PDA: "${Array.isArray(firstPda) ? (firstPda[0] ?? '').toString().substring(0, 50) : (firstPda ?? '').toString().substring(0, 50)}..."`
        );
      }

      const byContenido: { [contenido: string]: string[] } = {};

      contenidosArray.forEach((contenido, index) => {
        const pdaSet = new Set<string>();

        const rawEntry = pdaArray[index];
        if (rawEntry !== undefined) {
          console.log(`         🔗 Contenido[${index}] -> PDA[${index}]`);
          console.log(`            Contenido: "${contenido.substring(0, 40)}..."`);
          if (Array.isArray(rawEntry)) {
            console.log(`            PDA entry is array with ${rawEntry.length} items`);
            rawEntry.forEach(p => {
              if (typeof p === 'string' && p.trim()) pdaSet.add(p.trim());
            });
          } else if (typeof rawEntry === 'string') {
            console.log(`            PDA raw string: "${rawEntry.substring(0, 40)}..."`);
            const pdaIndividuales = separarPDAs(rawEntry);
            console.log(`            PDA split: ${pdaIndividuales.length} items`);
            pdaIndividuales.forEach(pda => pdaSet.add(pda));
          }
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

const GIST_URL = 'https://gist.githubusercontent.com/CePCCo-Asesores/5bee76f53b4251b8e99a0def8108eb11/raw/669fb6ec6f1c7512dba03bbc750300e817b062ab/CON_PLAN.JSON';

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
      
      console.log(`   ✅ Found ${pdaDeEsteContenido.length} PDA item(s)`);
      totalPdaCadenasFound += pdaDeEsteContenido.length;
      
      pdaDeEsteContenido.forEach((pda, cadenaIndex) => {
        const text = typeof pda === 'string' ? pda : String(pda);
        const trimmed = text.trim();
        if (!trimmed) return;
        console.log(`   📄 PDA ${cadenaIndex + 1}: "${trimmed.substring(0, 80)}..."`);
        const wasNew = !pdaSet.has(trimmed);
        pdaSet.add(trimmed);
        if (wasNew) {
          totalPdaIndividualesFound++;
          console.log(`      ✨ New PDA added`);
        } else {
          console.log(`      🔁 Duplicate PDA (skipped)`);
        }
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
    console.log('🔑 convertirGradoAKey INPUT:', { nivel, grado });
    
    // El JSON usa directamente el número de grado (1, 2, 3, etc.)
    // La diferenciación por nivel se hace por los nombres de campos formativos
    const result = grado;
    
    console.log('🔑 convertirGradoAKey OUTPUT:', result);
    return result;
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

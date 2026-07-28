from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path
from textwrap import dedent


PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONTENT_ROOT = PROJECT_ROOT / "content"
MAQUETAS_ROOT = CONTENT_ROOT / "maquetas"
BIOGRAPHY_ROOT = CONTENT_ROOT / "biografia"
PUBLIC_IMAGES_ROOT = PROJECT_ROOT / "public" / "imagenes"
LEGACY_IMAGES_ROOT = PROJECT_ROOT.parent / "FOTOS"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def entry(
    slug: str,
    title: str,
    municipality: str,
    province: str,
    building_type: str,
    category: str,
    *,
    summary: str | None = None,
    body: str | None = None,
    featured: bool = False,
    year_created: int | None = None,
    hero_image: str | None = None,
    original_image: str | None = None,
    original_still_exists: bool | None = None,
    map_query: str | None = None,
    materials: list[str] | None = None,
    construction_time: str | None = None,
    dimensions: str | None = None,
    scale: str | None = None,
    tags: list[str] | None = None,
    original_image_caption: str | None = None,
    original_building_history: str | None = None,
    legacy_source_folders: list[str] | None = None,
) -> dict:
    return {
        "slug": slug,
        "title": title,
        "municipality": municipality,
        "province": province,
        "buildingType": building_type,
        "category": category,
        "summary": summary or f"Maqueta en madera dedicada a {title}.",
        "body": body
        or f"Obra incluida en el inventario histórico del autor. La documentación disponible en el archivo local no aporta por ahora una descripción ampliada de {title.lower()}.",
        "featured": featured,
        "yearCreated": year_created,
        "heroImage": hero_image,
        "originalImage": original_image,
        "originalStillExists": original_still_exists,
        "mapQuery": map_query,
        "materials": materials,
        "constructionTime": construction_time,
        "dimensions": dimensions,
        "scale": scale,
        "tags": tags,
        "originalImageCaption": original_image_caption,
        "originalBuildingHistory": original_building_history,
        "legacySourceFolders": legacy_source_folders,
    }


BIOGRAPHY = {
    "frontmatter": {
        "title": "Heraclio Rodríguez García",
        "summary": "Artesano y autor de una extensa colección de maquetas de madera centradas en iglesias, catedrales, plazas, conventos y edificios históricos, con especial atención al patrimonio de Salamanca.",
        "birthplace": "La Fuente de San Esteban (Salamanca)",
        "yearOfBirth": 1950,
        "milestones": [
            "Nació en 1950 en La Fuente de San Esteban, localidad en la que ha transcurrido su vida familiar y laboral.",
            "Trabajó en banca durante más de cuarenta años.",
            "Comenzó su afición a las maquetas de madera en 2001.",
            "Una de las primeras obras nació al detectar que en el belén familiar faltaba el castillo de Herodes.",
            "Desde entonces ha reunido una colección extensa de maquetas, escenas y detalles arquitectónicos.",
        ],
        "techniques": [
            "Reproducción manual de volúmenes arquitectónicos y detalles ornamentales.",
            "Trabajo paciente de montaje y acabado, visible en cubiertas, ventanas, balcones y portadas.",
            "Observación minuciosa del edificio o elemento representado antes de traducirlo a madera.",
        ],
        "materials": [
            "Madera como material principal de construcción.",
            "Pequeñas piezas elaboradas y ajustadas una a una para cubiertas, rejerías y molduras.",
        ],
        "process": [
            "Selección del edificio, escena o motivo patrimonial a representar.",
            "Observación de proporciones, cubiertas, vanos y elementos singulares.",
            "Construcción manual pieza a pieza hasta completar la composición.",
            "Revisión final del conjunto y de los detalles ornamentales.",
        ],
    },
    "body": dedent(
        """
        Heraclio Rodríguez García es vecino de La Fuente de San Esteban, en la provincia de Salamanca. Nació en esta misma localidad en 1950 y allí ha desarrollado tanto su vida familiar como su trayectoria profesional.

        Tras más de cuarenta años dedicado a la banca, comenzó en 2001 una afición que terminaría convirtiéndose en un archivo artesanal de gran valor: la realización de maquetas de madera hechas completamente a mano. La antigua web del autor sitúa el inicio de esta dedicación en unas Navidades en las que el belén familiar necesitaba un castillo de Herodes. A partir de ese gesto doméstico, la actividad no dejó de crecer.

        La mayor parte de las obras representan iglesias, monumentos y edificios destacados de Castilla y León, con un foco muy claro en Salamanca y su provincia. Junto a los grandes volúmenes arquitectónicos aparecen también portadas, ventanas, balcones, plazas, aperos tradicionales y escenas vinculadas a la memoria local.

        El archivo fotográfico disponible muestra un método de trabajo muy minucioso, apoyado en la repetición paciente de piezas pequeñas y en la atención al detalle histórico y ornamental. Este catálogo digital intenta reflejar esa dedicación y ordenar la colección como si se tratara de una exposición permanente de patrimonio y artesanía.
        """
    ).strip(),
}


ENTRIES = [
    entry(
        "ayuntamiento-salamanca",
        "Ayuntamiento de Salamanca",
        "Salamanca",
        "Salamanca",
        "Ayuntamiento",
        "civil",
        summary="Maqueta en madera de la fachada del Ayuntamiento de Salamanca, pieza ligada a la Plaza Mayor.",
        body="""
La documentación del archivo local sitúa esta maqueta en 2002, coincidiendo con la conmemoración de los 250 años de la construcción de la Plaza Mayor de Salamanca.

En la descripción conservada se menciona la presencia de las cuatro virtudes cardinales en la espadaña y, debajo de ellas, las alegorías de la industria, la agricultura, la música y el comercio.
        """,
        featured=True,
        year_created=2002,
        hero_image="PC300210-2.JPG",
        original_image="fachadaPlazamayor.jpg",
        original_still_exists=True,
        map_query="Ayuntamiento de Salamanca",
        legacy_source_folders=["AyuntamientoSalamanca"],
    ),
    entry(
        "fachada-universidad-salamanca",
        "Fachada de la Universidad de Salamanca",
        "Salamanca",
        "Salamanca",
        "Universidad",
        "civil",
        summary="Maqueta en madera de la fachada histórica de la Universidad de Salamanca.",
        featured=True,
        hero_image="P9050011.JPG",
        original_still_exists=True,
        map_query="Fachada Universidad de Salamanca",
        legacy_source_folders=["FachadaUniversidad"],
    ),
    entry(
        "casa-de-las-conchas",
        "Casa de las Conchas",
        "Salamanca",
        "Salamanca",
        "Edificio civil histórico",
        "civil",
        summary="Maqueta en madera de uno de los edificios más reconocibles del casco histórico de Salamanca.",
        body="""
La documentación local describe la Casa de las Conchas como un edificio de estilo gótico con elementos platerescos. Sitúa el inicio de su construcción en 1493 y su finalización en 1517, por encargo de Rodrigo Arias Maldonado y Juana de Pimentel.

La maqueta se centra en la singularidad de su fachada y en el valor simbólico de las conchas, rasgo que ha convertido el edificio en una de las imágenes más conocidas del patrimonio salmantino.
        """,
        featured=True,
        hero_image="PC300201-2.jpg",
        original_image="casa-conchas-salamanca.jpg",
        original_still_exists=True,
        map_query="Casa de las Conchas Salamanca",
        legacy_source_folders=["CasaDelasConchas"],
    ),
    entry(
        "torre-catedral-nueva-salamanca",
        "Torre de la Catedral Nueva de Salamanca",
        "Salamanca",
        "Salamanca",
        "Catedral",
        "religioso",
        summary="Maqueta en madera de la Torre de la Catedral Nueva de Salamanca, una de las piezas más complejas del conjunto.",
        body="""
La descripción conservada señala que la Catedral Nueva fue construida entre 1513 y 1733 y combina elementos góticos y barrocos. También recuerda los daños sufridos durante el terremoto de Lisboa de 1755, que obligaron a reforzar la torre hasta la zona de campanas.

La maqueta dialoga con esa historia material y con la memoria del Mariquelo, figura asociada a la subida anual a la torre cada 31 de octubre.
        """,
        featured=True,
        hero_image="P3270044.JPG",
        original_image="Catedral_Nueva_de_Salamanca_Fachada_Exterior_44.jpg",
        original_still_exists=True,
        map_query="Catedral Nueva de Salamanca",
        legacy_source_folders=["TorreCatedral", "TorreCatedral/catedral"],
    ),
    entry(
        "patio-escuelas-menores-salamanca",
        "Patio de Escuelas Menores",
        "Salamanca",
        "Salamanca",
        "Patio histórico",
        "civil",
        summary="Maqueta en madera del Patio de Escuelas Menores de Salamanca, con el pozo central como referencia visual.",
        body="""
La documentación disponible lo presenta como un detalle del Patio de Escuelas Menores de Salamanca, con el pozo situado en el centro de la composición.
        """,
        hero_image="PC300208.JPG",
        original_still_exists=True,
        map_query="Patio de Escuelas Menores Salamanca",
        legacy_source_folders=["PatioDeEscuelas"],
    ),
    entry(
        "catedral-ciudad-rodrigo",
        "Catedral de Ciudad Rodrigo",
        "Ciudad Rodrigo",
        "Salamanca",
        "Catedral",
        "religioso",
        summary="Maqueta en madera dedicada a la Catedral de Ciudad Rodrigo, con especial atención a su torre y a su lenguaje románico.",
        body="""
En el archivo local se indica que la torre de la maqueta alcanza 130 centímetros de altura y que incorpora 3.200 tejas hechas de madera una a una.

Las descripciones asociadas a esta pieza también recuerdan la puerta románica llamada de las Cadenas y la vista aérea del claustro, dos de los elementos más singulares del monumento.
        """,
        featured=True,
        hero_image="PC300183-2.jpg",
        original_still_exists=True,
        map_query="Catedral de Santa María Ciudad Rodrigo",
        legacy_source_folders=["CatedralCiudadRodrigo"],
    ),
    entry(
        "iglesia-tamames",
        "Iglesia de Tamames",
        "Tamames",
        "Salamanca",
        "Iglesia",
        "religioso",
        summary="Maqueta en madera de la iglesia parroquial de Tamames.",
    ),
    entry(
        "iglesia-cubo-don-sancho",
        "Iglesia del Cubo de Don Sancho",
        "El Cubo de Don Sancho",
        "Salamanca",
        "Iglesia",
        "religioso",
        summary="Maqueta en madera de la iglesia de El Cubo de Don Sancho.",
    ),
    entry(
        "iglesia-villares-de-yeltes",
        "Iglesia de Villares de Yeltes",
        "Villares de Yeltes",
        "Salamanca",
        "Iglesia",
        "religioso",
        summary="Maqueta en madera de la iglesia de Villares de Yeltes.",
    ),
    entry(
        "iglesia-ituero-de-huebra",
        "Iglesia de Ituero de Huebra",
        "Ituero de Huebra",
        "Salamanca",
        "Iglesia",
        "religioso",
        summary="Maqueta en madera de la iglesia de Ituero de Huebra.",
    ),
    entry(
        "plaza-mayor-la-fuente-de-san-esteban",
        "Plaza Mayor de La Fuente de San Esteban",
        "La Fuente de San Esteban",
        "Salamanca",
        "Plaza histórica",
        "civil",
        summary="Maqueta en madera de la Plaza Mayor de La Fuente de San Esteban con su antiguo ayuntamiento y reloj.",
        body="""
La documentación del archivo la resume como una representación de la Plaza Mayor de La Fuente de San Esteban, con el antiguo ayuntamiento y el reloj como elementos principales.
        """,
        featured=True,
        original_still_exists=True,
        map_query="Plaza Mayor La Fuente de San Esteban",
    ),
    entry(
        "balconada-antigua-la-fuente-de-san-esteban",
        "Balconada antigua de la Plaza Mayor de La Fuente de San Esteban",
        "La Fuente de San Esteban",
        "Salamanca",
        "Conjunto urbano histórico",
        "civil",
        summary="Recreación en madera de la antigua balconada de la Plaza Mayor de La Fuente de San Esteban.",
        body="""
La descripción disponible sitúa esta obra en la década de 1960, antes del derribo y reforma del frente de plaza que hoy ha desaparecido. Se citan gradas de madera, el toril, varios bares y casas concretas del entorno.

La pieza tiene un claro valor de memoria urbana, porque no solo reproduce un edificio sino una configuración histórica del espacio público hoy desaparecida.
        """,
        original_still_exists=False,
        original_image="plazafuentesantigua.jpg",
        legacy_source_folders=["PlazaLaFuente"],
    ),
    entry(
        "iglesia-santa-olalla-de-yeltes",
        "Iglesia de Santa Olalla de Yeltes",
        "Santa Olalla de Yeltes",
        "Salamanca",
        "Iglesia",
        "religioso",
        summary="Maqueta en madera de la iglesia de Santa Olalla de Yeltes.",
        featured=True,
        hero_image="P8200160.JPG",
        original_image="SanIsidro-collage.jpeg",
        original_still_exists=True,
        map_query="Iglesia de Santa Olalla de Yeltes",
        legacy_source_folders=["IglesiaSantaOlalla"],
    ),
    entry(
        "ayuntamiento-ciudad-rodrigo",
        "Ayuntamiento de Ciudad Rodrigo",
        "Ciudad Rodrigo",
        "Salamanca",
        "Ayuntamiento",
        "civil",
        summary="Maqueta en madera de la fachada del Ayuntamiento de Ciudad Rodrigo.",
        hero_image="PC300172.JPG",
        original_image="ayuntamientoCiudad.jpg",
        original_still_exists=True,
        map_query="Ayuntamiento de Ciudad Rodrigo",
        legacy_source_folders=["AyuntamientoCiudadRodrigo"],
    ),
    entry(
        "iglesia-san-munoz",
        "Iglesia de San Muñoz",
        "San Muñoz",
        "Salamanca",
        "Iglesia",
        "religioso",
        summary="Maqueta en madera de la iglesia de San Muñoz.",
    ),
    entry(
        "ermita-nuestra-senora-remedios-buenamadre",
        "Ermita de Nuestra Señora de los Remedios",
        "Buenamadre",
        "Salamanca",
        "Ermita",
        "religioso",
        summary="Maqueta en madera de la ermita de Nuestra Señora de los Remedios, en Buenamadre.",
    ),
    entry(
        "carro-castellano-de-bueyes",
        "Carro castellano de bueyes",
        "La Fuente de San Esteban",
        "Salamanca",
        "Escena tradicional",
        "costumbrista",
        summary="Pieza de temática tradicional dedicada al carro de bueyes castellano y sus complementos.",
        body="""
La documentación del archivo describe un carro de bueyes de estilo castellano con varios complementos: botijo bajo el carro, tableros para la carga de cereales, yugo y mozos de apoyo.
        """,
    ),
    entry(
        "pareja-bueyes-con-vertedera",
        "Pareja de bueyes con vertedera",
        "La Fuente de San Esteban",
        "Salamanca",
        "Escena tradicional",
        "costumbrista",
        summary="Obra dedicada a una yunta castellana con yugo ligero, cencerras y útiles asociados al trabajo agrario.",
        body="""
El archivo local menciona una yunta castellana con yugo ligero para vacas, mosquiteras en los cuernos, cencerras y coyundas, acompañada de otras piezas tradicionales de madera y uso ganadero.
        """,
    ),
    entry(
        "casa-munecas-sara",
        "Casa de muñecas de Sara",
        "Salamanca",
        "Salamanca",
        "Casa de muñecas",
        "costumbrista",
        summary="Casa de muñecas realizada en madera para Sara.",
    ),
    entry(
        "casa-munecas-alba",
        "Casa de muñecas de Alba",
        "Salamanca",
        "Salamanca",
        "Casa de muñecas",
        "costumbrista",
        summary="Casa de muñecas realizada en madera para Alba.",
    ),
    entry(
        "desenjaule-toro-bravo",
        "Desenjaule de toro bravo",
        "Salamanca",
        "Salamanca",
        "Escena tradicional",
        "costumbrista",
        summary="Escena en madera dedicada al desenjaule de un toro bravo.",
        hero_image="PC300269.JPG",
        legacy_source_folders=["Desenjaule"],
    ),
    entry(
        "castillo-cubo-don-sancho",
        "Castillo de El Cubo de Don Sancho",
        "El Cubo de Don Sancho",
        "Salamanca",
        "Castillo",
        "civil",
        summary="Maqueta en madera del castillo de El Cubo de Don Sancho.",
    ),
    entry(
        "belen-maleta-madera",
        "Belén en maleta de madera",
        "Salamanca",
        "Salamanca",
        "Belén portátil",
        "costumbrista",
        summary="Belén de madera resuelto como pieza portátil en formato de maleta.",
        hero_image="P8200280.JPG",
        legacy_source_folders=["MaletaBelen"],
    ),
    entry(
        "teatro-maleta-madera",
        "Teatro en maleta de madera",
        "Salamanca",
        "Salamanca",
        "Teatro portátil",
        "costumbrista",
        summary="Pieza portátil en madera concebida como pequeño teatro en maleta.",
    ),
    entry(
        "ajedrez-de-pajaros",
        "Ajedrez de pájaros",
        "Salamanca",
        "Salamanca",
        "Objeto lúdico",
        "costumbrista",
        summary="Tablero de ajedrez de madera cuyas piezas representan distintas aves.",
        body="""
La documentación conservada indica que los peones son gaviotas y pingüinos, las torres ocas, los caballos cigüeñas, los alfiles garzas, las reinas flamencos y los reyes avestruces.
        """,
        hero_image="P8200272.JPG",
        legacy_source_folders=["Ajedrez"],
    ),
    entry(
        "casitas-belen",
        "Casitas de belén",
        "Salamanca",
        "Salamanca",
        "Belén",
        "costumbrista",
        summary="Conjunto de casitas que formaban parte del nacimiento o belén.",
        body="""
La documentación disponible identifica estas piezas como las casitas que componían el nacimiento.
        """,
        hero_image="belen.jpg",
        legacy_source_folders=["Belén"],
    ),
    entry(
        "acueducto-de-segovia",
        "Acueducto de Segovia",
        "Segovia",
        "Segovia",
        "Infraestructura histórica",
        "civil",
        summary="Maqueta en madera de un detalle del acueducto romano de Segovia.",
        body="""
La documentación conservada habla expresamente de un detalle del acueducto romano de Segovia.
        """,
        featured=True,
        hero_image="acueducto.jpg",
        original_image="acueducto.jpg",
        original_still_exists=True,
        map_query="Acueducto de Segovia",
        legacy_source_folders=["Acueducto"],
    ),
    entry(
        "campanario-iglesia-pizarrales",
        "Campanario de la iglesia de Pizarrales",
        "Salamanca",
        "Salamanca",
        "Detalle arquitectónico",
        "detalle",
        summary="Cuadro en madera dedicado al campanario de la iglesia del barrio de Pizarrales.",
    ),
    entry(
        "fachada-casa-monleon",
        "Fachada de la Casa de Monleón",
        "Salamanca",
        "Salamanca",
        "Detalle arquitectónico",
        "detalle",
        summary="Cuadro en madera de la fachada de la Casa de Monleón, en Salamanca.",
        body="""
La documentación disponible la identifica de forma directa como fachada de la Casa de Monleón, en Salamanca.
        """,
    ),
    entry(
        "puerta-romanica-san-martin",
        "Puerta románica de la iglesia de San Martín",
        "Salamanca",
        "Salamanca",
        "Detalle arquitectónico",
        "religioso",
        summary="Cuadro en madera de la portada románica de la iglesia de San Martín, en la Plaza del Corrillo.",
        body="""
La documentación la describe como la fachada románica de la iglesia de San Martín, dedicada a San Martín de Tours y construida entre 1140 y 1170. También menciona la imagen superior de San Martín a caballo compartiendo su capa con los pobres.
        """,
        original_still_exists=True,
        map_query="Iglesia de San Martín Salamanca",
    ),
    entry(
        "puerta-principal-san-martin",
        "Puerta principal de la iglesia de San Martín",
        "Salamanca",
        "Salamanca",
        "Detalle arquitectónico",
        "religioso",
        summary="Cuadro en madera de la fachada sur o puerta principal de la iglesia de San Martín.",
        body="""
La descripción conservada sitúa esta vista de San Martín en la Plaza del Corrillo y la entiende como la entrada principal por el sur, vinculándola con la calle de la Rúa Mayor.
        """,
        original_still_exists=True,
        map_query="Iglesia de San Martín Salamanca",
    ),
    entry(
        "fachada-colegio-fonseca",
        "Fachada del Colegio Fonseca",
        "Salamanca",
        "Salamanca",
        "Colegio histórico",
        "civil",
        summary="Cuadro en madera de la fachada renacentista del Colegio Fonseca.",
        body="""
La documentación lo presenta como un edificio renacentista iniciado en 1521 por el arzobispo Fonseca. También recuerda que se conoce como Colegio de los Irlandeses y subraya la presencia de un patio renacentista especialmente notable.
        """,
        original_still_exists=True,
        map_query="Colegio Fonseca Salamanca",
    ),
    entry(
        "ventana-casa-de-las-muertes",
        "Ventana de la Casa de las Muertes",
        "Salamanca",
        "Salamanca",
        "Detalle arquitectónico",
        "civil",
        summary="Detalle en madera de una ventana de la Casa de las Muertes, en la calle Bordadores de Salamanca.",
        body="""
La documentación disponible sitúa esta ventana en la Casa de las Muertes, edificio plateresco construido en torno a 1500 y asociado a Alfonso de Fonseca.
        """,
        original_still_exists=True,
        map_query="Casa de las Muertes Salamanca",
    ),
    entry(
        "portada-de-las-bernardas",
        "Portada de las Bernardas",
        "Salamanca",
        "Salamanca",
        "Convento",
        "religioso",
        summary="Detalle en madera de la portada del antiguo convento de las Bernardas.",
        body="""
La documentación la describe como una fachada renacentista organizada como arco triunfal entre contrafuertes y coronada por bóveda de cañón, con medallones de San Pedro y San Pablo, una hornacina con la Virgen y varios escudos de sus fundadores.
        """,
        original_still_exists=True,
        map_query="Convento de las Bernardas Salamanca",
    ),
    entry(
        "fachada-palacio-anaya",
        "Fachada del Palacio de Anaya",
        "Salamanca",
        "Salamanca",
        "Palacio",
        "civil",
        summary="Cuadro en madera de la portada del Palacio de Anaya, actual Facultad de Filología.",
        body="""
La documentación la vincula con el Colegio de Anaya, fundado en 1411 por Diego de Anaya. También recuerda sus usos históricos y su transformación en actual sede académica.
        """,
        original_still_exists=True,
        map_query="Palacio de Anaya Salamanca",
    ),
    entry(
        "portada-iglesia-san-pablo",
        "Portada de la iglesia de San Pablo",
        "Salamanca",
        "Salamanca",
        "Detalle arquitectónico",
        "religioso",
        summary="Detalle en madera de la portada de la iglesia de San Pablo, en Salamanca.",
        original_still_exists=True,
        map_query="Iglesia de San Pablo Salamanca",
    ),
    entry(
        "portico-iglesia-san-roman",
        "Pórtico de la iglesia de San Román",
        "Salamanca",
        "Salamanca",
        "Detalle arquitectónico",
        "religioso",
        summary="Detalle en madera del pórtico de la iglesia de San Román, en Salamanca.",
        original_still_exists=True,
        map_query="Iglesia de San Román Salamanca",
    ),
]


def yaml_line(key: str, value, lines: list[str]) -> None:
    if value is None:
        return
    if isinstance(value, bool):
        lines.append(f"{key}: {'true' if value else 'false'}")
        return
    if isinstance(value, (int, float)):
        lines.append(f"{key}: {value}")
        return
    if isinstance(value, list):
        if not value:
            return
        lines.append(f"{key}:")
        for item in value:
            lines.append(f"  - {json.dumps(item, ensure_ascii=False)}")
        return
    lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")


def build_frontmatter(data: dict) -> str:
    lines = ["---"]
    for key, value in data.items():
        yaml_line(key, value, lines)
    lines.append("---")
    return "\n".join(lines)


def write_markdown_file(path: Path, frontmatter: dict, body: str, force: bool) -> None:
    if path.exists() and not force:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    content = f"{build_frontmatter(frontmatter)}\n\n{dedent(body).strip()}\n"
    path.write_text(content, encoding="utf-8")


def copy_images(slug: str, sources: list[str], force: bool) -> None:
    destination = PUBLIC_IMAGES_ROOT / slug
    if destination.exists() and force:
        shutil.rmtree(destination)
    destination.mkdir(parents=True, exist_ok=True)

    for relative_source in sources:
        source = LEGACY_IMAGES_ROOT / relative_source
        if not source.exists():
            continue
        for file_path in source.iterdir():
            if not file_path.is_file() or file_path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            target = destination / file_path.name
            if target.exists() and not force:
                continue
            shutil.copy2(file_path, target)


def seed(force: bool, copy_media: bool) -> None:
    BIOGRAPHY_ROOT.mkdir(parents=True, exist_ok=True)
    MAQUETAS_ROOT.mkdir(parents=True, exist_ok=True)
    PUBLIC_IMAGES_ROOT.mkdir(parents=True, exist_ok=True)

    biography_file = BIOGRAPHY_ROOT / "heraclio-rodriguez-garcia.md"
    write_markdown_file(biography_file, BIOGRAPHY["frontmatter"], BIOGRAPHY["body"], force)

    for item in ENTRIES:
        current = dict(item)
        body = current.pop("body")
        file_path = MAQUETAS_ROOT / f"{current['slug']}.md"
        write_markdown_file(file_path, current, body, force)
        if copy_media and current.get("legacySourceFolders"):
            copy_images(current["slug"], current["legacySourceFolders"], force)


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera el contenido inicial del catálogo y copia imágenes claras desde el archivo legado.")
    parser.add_argument("--force", action="store_true", help="Sobrescribe fichas existentes y rehace las carpetas de imágenes generadas.")
    parser.add_argument("--copy-media", action="store_true", help="Copia imágenes desde MAQUETAS/FOTOS hacia public/imagenes/<slug>.")
    args = parser.parse_args()
    seed(force=args.force, copy_media=args.copy_media)


if __name__ == "__main__":
    main()
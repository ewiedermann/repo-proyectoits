# 🦖 Datos de Dinosaurios

Este directorio contiene información sobre una selección de dinosaurios, incluyendo datos científicos y curiosidades. Los datos están estructurados en formato JSON y pueden ser utilizados fácilmente desde aplicaciones web o APIs locales.

## 📄 Archivo principal

- **Nombre:** `dinosaurio.json`
- **Ubicación:** `/src/data/dinosaurio.json`
- **Formato:** JSON
- **Descripción:** Lista de objetos que representan distintos tipos de dinosaurios con atributos como nombre científico, tipo de alimentación, periodo geológico, tamaño, peso, ubicación geográfica y una curiosidad destacada.

---

## 🧾 Estructura de cada entrada

Cada objeto tiene los siguientes campos:

| Campo              | Tipo     | Descripción                                  |
|--------------------|----------|----------------------------------------------|
| `nombreCientifico` | string   | Nombre científico completo del dinosaurio.   |
| `nombreComun`      | string   | Nombre común o popular del dinosaurio.       |
| `tipoAlimentacion` | string   | Dieta predominante (ej: Carnívoro, Herbívoro). |
| `periodo`          | string   | Periodo geológico en el cual vivió.          |
| `tamano`           | string   | Tamaño promedio (en metros).                 |
| `peso`             | string   | Peso promedio (en kg o toneladas).           |
| `ubicacionGeografica` | string | Región o continente donde habitaba.         |
| `curiosidades`     | string   | Dato interesante sobre el dinosaurio.        |
| `image`            | string   | Ruta relativa a la imagen del dinosaurio.    |

---

## 🦕 Ejemplo de registro

```json
{
  "nombreCientifico": "Tyrannosaurus Rex",
  "nombreComun": "T. Rex",
  "tipoAlimentacion": "Carnívoro",
  "periodo": "Cretácico",
  "tamano": "12 metros",
  "peso": "8 toneladas",
  "ubicacionGeografica": "Norteamérica",
  "curiosidades": "Tenía más de 60 dientes afilados de hasta 30 cm.",
  "image": "../public/images/t-rex.png"
}
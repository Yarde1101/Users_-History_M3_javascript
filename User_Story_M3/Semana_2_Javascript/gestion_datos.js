
// Un "objeto" es como una ficha con información.
// Cada producto tiene: id, nombre y precio.
 
const producto1 = {
  id: 1,
  nombre: "Manzana",
  precio: 1500
};
 
const producto2 = {
  id: 2,
  nombre: "Leche",
  precio: 3200
};
 
const producto3 = {
  id: 3,
  nombre: "Pan",
  precio: 2800
};
 
// También creamos un producto con datos inválidos para probar la validación
const producto4 = {
  id: null,       // ← id inválido (no tiene valor)
  nombre: "",     // ← nombre inválido (está vacío)
  precio: -500    // ← precio inválido (no puede ser negativo)
};

// Una "función" es un bloque de código que hace una tarea específica.
// Esta función revisa que el producto tenga id, nombre y precio correctos.
 
function esProductoValido(producto) {
  if (!producto.id) {
    console.log(" Error: El producto no tiene un id válido.");
    return false; // "return false" significa: "este producto NO es válido"
  }
  if (!producto.nombre || producto.nombre.trim() === "") {
    console.log(" Error: El producto no tiene un nombre válido.");
    return false;
  }
  if (typeof producto.precio !== "number" || producto.precio <= 0) {
    console.log(" Error: El precio debe ser un número mayor a 0.");
    return false;
  }
  return true; // Si pasó todas las pruebas, el producto SÍ es válido
}
 
// Probamos la validación con nuestros productos:
console.log("=== VALIDACIÓN DE PRODUCTOS ===");
console.log("Producto 1 válido:", esProductoValido(producto1)); // true
console.log("Producto 2 válido:", esProductoValido(producto2)); // true
console.log("Producto 3 válido:", esProductoValido(producto3)); // true
console.log("Producto 4 válido:", esProductoValido(producto4)); // false

 
console.log("\n=== PROPIEDADES DEL PRODUCTO 1 (for...in) ===");
for (let propiedad in producto1) {
  // "propiedad" toma el nombre del campo: "id", "nombre", "precio"
  // "producto1[propiedad]" nos da el valor de ese campo
  console.log(propiedad + ": " + producto1[propiedad]);
}
 
// Un "Set" es una lista ESPECIAL que NO permite valores repetidos.
// Imagínalo como una bolsa donde si metes dos cosas iguales, solo queda una.
 
console.log("\n=== USO DEL SET ===");
 
// Creamos un Set con números repetidos (los duplicados se eliminan solos)
const numerosUnicos = new Set([10, 20, 30, 20, 10, 40, 30, 50]);
 
// Mostramos el Set completo (ya sin duplicados)
console.log("Set sin duplicados:", numerosUnicos);
 
// Agregamos un número nuevo con .add()
numerosUnicos.add(60);
console.log("Después de agregar el 60:", numerosUnicos);
 
// Verificamos si un número existe con .has()
console.log("¿El 20 está en el Set?", numerosUnicos.has(20)); // true
console.log("¿El 99 está en el Set?", numerosUnicos.has(99)); // false
 
// Eliminamos un número con .delete()
numerosUnicos.delete(30);
console.log("Después de eliminar el 30:", numerosUnicos);
 
// Recorremos el Set con for...of para mostrar cada valor
console.log("Valores del Set uno por uno:");
for (let numero of numerosUnicos) {
  console.log("  →", numero);
}
  
// Un "Map" es como un diccionario: tiene una CLAVE y un VALOR.
// En este caso: la CLAVE es la categoría, el VALOR es el nombre del producto.
 
console.log("\n=== USO DEL MAP ===");
 
// Creamos el Map y lo llenamos con .set(clave, valor)
const categoriaProducto = new Map();
categoriaProducto.set("Fruta", "Manzana");
categoriaProducto.set("Lácteo", "Leche");
categoriaProducto.set("Panadería", "Pan");
 
// Mostramos el Map completo
console.log("Map de categorías:", categoriaProducto);
 
// Recorremos el Map con forEach para mostrar clave y valor
console.log("Categorías y productos:");
categoriaProducto.forEach(function(valor, clave) {
  // "clave" = categoría, "valor" = nombre del producto
  console.log("  Categoría: " + clave + " → Producto: " + valor);
});

 
// Guardamos los productos válidos en un "array" (lista ordenada)
const listaProductos = [producto1, producto2, producto3];
 
console.log("\n=== LISTA COMPLETA DE PRODUCTOS ===");
for (let producto of listaProductos) {
  console.log("ID:", producto.id, "| Nombre:", producto.nombre, "| Precio: $" + producto.precio);
}
 
// Usamos un Set para guardar solo los NOMBRES únicos de productos
const nombresUnicos = new Set();
for (let producto of listaProductos) {
  nombresUnicos.add(producto.nombre);
}
 
console.log("\n=== LISTA DE PRODUCTOS ÚNICOS (Set) ===");
for (let nombre of nombresUnicos) {
  console.log(" •", nombre);
}
 
 
console.log("\n=== RESUMEN FINAL ===");
console.log("Total de productos:", listaProductos.length);
console.log("Categorías registradas en el Map:", categoriaProducto.size);
console.log("Números únicos en el Set:", numerosUnicos.size);
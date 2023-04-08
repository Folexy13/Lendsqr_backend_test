/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.integer("wallet").unsigned();
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(null);
    }),
    knex.schema.createTable("transactions", function (table) {
      table.increments("id").primary();
      table.string("reference").notNullable();
      table.string("type").notNullable();
      table.integer("amount").notNullable();
      table.string("status").notNullable();
      table.string("transfer_ref").notNullable();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("gateway").defaultTo("Paystack");
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(null);
    }),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("users"),
    knex.schema.dropTable("transactions"),
  ]);
};

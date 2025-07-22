using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VehicleManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class Add_VehicleLocation_Index : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_VehicleLocations_VehicleId",
                table: "VehicleLocations");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleLocation_VehicleId_Timestamp",
                table: "VehicleLocations",
                columns: new[] { "VehicleId", "Timestamp" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_VehicleLocation_VehicleId_Timestamp",
                table: "VehicleLocations");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleLocations_VehicleId",
                table: "VehicleLocations",
                column: "VehicleId");
        }
    }
}

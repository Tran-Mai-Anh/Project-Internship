using System.ComponentModel.DataAnnotations;

namespace VehicleManagementSystem.Models.Entities
{
    public class Role
    {
        public int Id { get; set; }

        [Required]
        public string RoleName { get; set; }
        public string Discription { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}

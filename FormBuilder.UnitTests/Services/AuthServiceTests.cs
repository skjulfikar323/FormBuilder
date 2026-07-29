using AutoMapper;
using FluentAssertions;
using FormBuilder.Core.DTOs.Auth;
using FormBuilder.Core.DTOs.User;
using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using FormBuilder.Service.Implement;
using FormBuilder.Service.Interface;
using FormBuilder.Service.Mappings;
using Moq;
using Xunit;

namespace FormBuilder.UnitTests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<IJwtService> _jwt = new();
    private readonly IMapper _mapper;
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<AuthMappingProfile>());
        _mapper = config.CreateMapper();
        _sut = new AuthService(_userRepo.Object, _jwt.Object, _mapper);
    }

    [Fact]
    public async Task RegisterAsync_WithValidData_ReturnsSuccessAndToken()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            Username = "julfikar",
            Email = "julfikar@example.com",
            Password = "Secret123!"
        };
        _userRepo.Setup(r => r.ExistsByEmailAsync(It.IsAny<string>())).ReturnsAsync(false);
        _userRepo.Setup(r => r.ExistsByUsernameAsync(It.IsAny<string>())).ReturnsAsync(false);
        _userRepo.Setup(r => r.InsertAsync(It.IsAny<User>())).Returns(Task.CompletedTask);
        _jwt.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("fake-jwt");

        // Act
        var result = await _sut.RegisterAsync(dto);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Token.Should().Be("fake-jwt");
        result.Data.User.Email.Should().Be("julfikar@example.com");
        _userRepo.Verify(r => r.InsertAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ReturnsFail()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            Username = "julfikar",
            Email = "julfikar@example.com",
            Password = "Secret123!"
        };
        _userRepo.Setup(r => r.ExistsByEmailAsync(It.IsAny<string>())).ReturnsAsync(true);

        // Act
        var result = await _sut.RegisterAsync(dto);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("already exists");
        _userRepo.Verify(r => r.InsertAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_WithShortPassword_ReturnsValidationError()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            Username = "julfikar",
            Email = "julfikar@example.com",
            Password = "short"
        };

        // Act
        var result = await _sut.RegisterAsync(dto);

        // Assert
        result.Success.Should().BeFalse();
        result.Errors.Should().ContainKey("password");
        _userRepo.Verify(r => r.InsertAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_WithWrongPassword_ReturnsFail()
    {
        // Arrange
        var user = new User
        {
            Id = "u1",
            Email = "test@test.com",
            Username = "test",
            PasswordHash = FormBuilder.Utilities.PasswordHasher.Hash("correct-pass")
        };
        _userRepo.Setup(r => r.GetByEmailAsync("test@test.com")).ReturnsAsync(user);

        // Act
        var result = await _sut.LoginAsync(new LoginRequestDto
        {
            Email = "test@test.com",
            Password = "WRONG-pass"
        });

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("Invalid");
    }
}
